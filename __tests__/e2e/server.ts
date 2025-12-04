/**
 * E2E test server manager
 * Starts/stops the Next.js dev server for E2E tests
 */
import { spawn, ChildProcess } from 'child_process';
import { randomBytes } from 'crypto';

export class TestServer {
  private process: ChildProcess | null = null;
  private port: number;
  public baseUrl: string;

  constructor(port: number = 3001) {
    this.port = port;
    this.baseUrl = `http://localhost:${port}`;
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Start Next.js dev server on a test port
      this.process = spawn('npm', ['run', 'dev', '--', '-p', String(this.port)], {
        env: {
          ...process.env,
          NODE_ENV: 'test',
          PORT: String(this.port),
        },
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let started = false;
      const timeout = setTimeout(() => {
        if (!started) {
          this.stop();
          reject(new Error('Server failed to start within 60 seconds'));
        }
      }, 60000);

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log(`[Server] ${output}`);
        
        // Look for "Local:" or "ready" indicators
        if ((output.includes('Local:') || output.includes('ready')) && !started) {
          started = true;
          clearTimeout(timeout);
          // Give it a bit more time to be fully ready
          setTimeout(() => resolve(), 2000);
        }
      });

      this.process.stderr?.on('data', (data) => {
        console.error(`[Server Error] ${data.toString()}`);
      });

      this.process.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.process.on('exit', (code) => {
        if (!started && code !== 0) {
          clearTimeout(timeout);
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }

  async stop(): Promise<void> {
    if (this.process) {
      return new Promise((resolve) => {
        this.process!.on('exit', () => {
          resolve();
        });
        
        // Kill process tree on Windows
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(this.process!.pid), '/f', '/t'], {
            shell: true,
          });
        } else {
          this.process!.kill('SIGTERM');
        }

        // Force kill after 5 seconds
        setTimeout(() => {
          if (this.process) {
            this.process.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    }
  }

  /**
   * Generate a unique test identifier for isolation
   */
  generateTestId(): string {
    return `test-${randomBytes(8).toString('hex')}`;
  }
}
