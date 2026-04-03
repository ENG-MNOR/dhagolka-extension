// import * as vscode from 'vscode';
// import * as path from 'path';

// const audioPlayer = (() => {
//   try {
//     const ps = require('play-sound');
//     return ps({});
//   } catch(e) {
//     console.error('DhagoolkaSound: play-sound load failed:', e);
//     return null;
//   }
// })();

// let previousErrorCount = 0;
// let diagnosticListener: vscode.Disposable | undefined;

// // Play the sound
// function playFahh(context: vscode.ExtensionContext) {
//   const config = vscode.workspace.getConfiguration('dhagoolkaSound');
//   const enabled = config.get<boolean>('enabled', true);

//   if (!enabled || !audioPlayer) return;

//   const soundPath = path.join(context.extensionPath, 'sounds', 'fahhhhh.mp3');

//   audioPlayer.play(soundPath, (err: any) => {
//     if (err) {
//       console.error('DhagoolkaSound: Could not play sound:', err);
//     }
//   });
// }

// // Count errors (and optionally warnings) across all open files
// function countProblems(): number {
//   const config = vscode.workspace.getConfiguration('dhagoolkaSound');
//   const minSeverity = config.get<string>('minSeverity', 'error');

//   let count = 0;

//   vscode.languages.getDiagnostics().forEach(([, diagnostics]) => {
//     diagnostics.forEach(diag => {
//       if (minSeverity === 'warning') {
//         if (
//           diag.severity === vscode.DiagnosticSeverity.Error ||
//           diag.severity === vscode.DiagnosticSeverity.Warning
//         ) {
//           count++;
//         }
//       } else {
//         if (diag.severity === vscode.DiagnosticSeverity.Error) {
//           count++;
//         }
//       }
//     });
//   });

//   return count;
// }

// export function activate(context: vscode.ExtensionContext) {
//   console.log('DhagoolkaSound is now active!');

//   // Initialize with current error count (don't play on startup)
//   previousErrorCount = countProblems();

//   // Watch for diagnostic changes (errors/warnings)
//   diagnosticListener = vscode.languages.onDidChangeDiagnostics(() => {
//     const currentErrorCount = countProblems();

//     // Only play sound if errors INCREASED (new error was introduced)
//     if (currentErrorCount > previousErrorCount) {
//       playFahh(context);
//     }

//     previousErrorCount = currentErrorCount;
//   });

//   // Register a manual test command
//   const testCommand = vscode.commands.registerCommand(
//     'dhagoolkaSound.testSound',
//     () => {
//       vscode.window.showInformationMessage('Testing dhagoolka sound... 🔊');
//       playFahh(context);
//     }
//   );

//   // Register toggle command
//   const toggleCommand = vscode.commands.registerCommand(
//     'dhagoolkaSound.toggle',
//     () => {
//       const config = vscode.workspace.getConfiguration('dhagoolkaSound');
//       const current = config.get<boolean>('enabled', true);
//       config.update('enabled', !current, vscode.ConfigurationTarget.Global);
//       vscode.window.showInformationMessage(
//         `DhagoolkaSound ${!current ? 'enabled 🔊' : 'disabled 🔇'}`
//       );
//     }
//   );

//   context.subscriptions.push(diagnosticListener, testCommand, toggleCommand);
// }

// export function deactivate() {
//   if (diagnosticListener) {
//     diagnosticListener.dispose();
//   }
// }

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import { pathToFileURL } from 'url';

let previousErrorCount = 0;
let diagnosticListener: vscode.Disposable | undefined;

function playWindows(soundPath: string): void {
  const uri = pathToFileURL(soundPath).href.replace(/'/g, "''");
  const script = [
    'Add-Type -AssemblyName PresentationCore',
    '$p = New-Object System.Windows.Media.MediaPlayer',
    `$p.Open([uri]'${uri}')`,
    '$p.Play()',
    'Start-Sleep -Seconds 5',
  ].join('; ');
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  cp.spawn(
    'powershell.exe',
    [
      '-NoProfile',
      '-NonInteractive',
      '-WindowStyle',
      'Hidden',
      '-EncodedCommand',
      encoded,
    ],
    { detached: true, stdio: 'ignore', windowsHide: true }
  ).unref();
}

function playFahh(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('dhagoolkaSound');
  const enabled = config.get<boolean>('enabled', true);

  if (!enabled) return;

  const soundPath = path.join(context.extensionPath, 'sounds', 'fahhhhh.mp3');
  if (!fs.existsSync(soundPath)) {
    console.error('DhagoolkaSound: Missing sounds/fahhhhh.mp3');
    return;
  }

  try {
    if (process.platform === 'darwin') {
      cp.spawn('afplay', [soundPath], { detached: true, stdio: 'ignore' }).unref();
    } else if (process.platform === 'win32') {
      playWindows(soundPath);
    } else {
      console.warn('DhagoolkaSound: Playback is only supported on macOS and Windows');
    }
  } catch (err) {
    console.error('DhagoolkaSound: Could not play sound:', err);
  }
}

// Count errors (and optionally warnings) across all open files
function countProblems(): number {
  const config = vscode.workspace.getConfiguration('dhagoolkaSound');
  const minSeverity = config.get<string>('minSeverity', 'error');

  let count = 0;

  vscode.languages.getDiagnostics().forEach(([, diagnostics]) => {
    diagnostics.forEach(diag => {
      if (minSeverity === 'warning') {
        if (
          diag.severity === vscode.DiagnosticSeverity.Error ||
          diag.severity === vscode.DiagnosticSeverity.Warning
        ) {
          count++;
        }
      } else {
        if (diag.severity === vscode.DiagnosticSeverity.Error) {
          count++;
        }
      }
    });
  });

  return count;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('DhagoolkaSound is now active!');

  // Initialize with current error count (don't play on startup)
  previousErrorCount = countProblems();

  // Watch for diagnostic changes (errors/warnings)
  diagnosticListener = vscode.languages.onDidChangeDiagnostics(() => {
    const currentErrorCount = countProblems();

    // Only play sound if errors INCREASED (new error was introduced)
    if (currentErrorCount > previousErrorCount) {
      playFahh(context);
    }

    previousErrorCount = currentErrorCount;
  });

  // Register a manual test command
  const testCommand = vscode.commands.registerCommand(
    'dhagoolkaSound.testSound',
    () => {
      vscode.window.showInformationMessage('Testing dhagoolka sound... 🔊');
      playFahh(context);
    }
  );

  // Register toggle command
  const toggleCommand = vscode.commands.registerCommand(
    'dhagoolkaSound.toggle',
    () => {
      const config = vscode.workspace.getConfiguration('dhagoolkaSound');
      const current = config.get<boolean>('enabled', true);
      config.update('enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `DhagoolkaSound ${!current ? 'enabled 🔊' : 'disabled 🔇'}`
      );
    }
  );

  context.subscriptions.push(diagnosticListener, testCommand, toggleCommand);
}

export function deactivate() {
  if (diagnosticListener) {
    diagnosticListener.dispose();
  }
}