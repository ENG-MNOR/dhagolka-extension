// import * as vscode from 'vscode';
// import * as path from 'path';

// const audioPlayer = (() => {
//   try {
//     const ps = require('play-sound');
//     return ps({});
//   } catch(e) {
//     console.error('FaahhSound: play-sound load failed:', e);
//     return null;
//   }
// })();

// let previousErrorCount = 0;
// let diagnosticListener: vscode.Disposable | undefined;

// // Play the faahh sound
// function playFahh(context: vscode.ExtensionContext) {
//   const config = vscode.workspace.getConfiguration('faahhSound');
//   const enabled = config.get<boolean>('enabled', true);

//   if (!enabled || !audioPlayer) return;

//   const soundPath = path.join(context.extensionPath, 'sounds', 'fahhhhh.mp3');

//   audioPlayer.play(soundPath, (err: any) => {
//     if (err) {
//       console.error('FaahhSound: Could not play sound:', err);
//     }
//   });
// }

// // Count errors (and optionally warnings) across all open files
// function countProblems(): number {
//   const config = vscode.workspace.getConfiguration('faahhSound');
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
//   console.log('FaahhSound is now active!');

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
//     'faahhSound.testSound',
//     () => {
//       vscode.window.showInformationMessage('Testing faahh sound... 🔊');
//       playFahh(context);
//     }
//   );

//   // Register toggle command
//   const toggleCommand = vscode.commands.registerCommand(
//     'faahhSound.toggle',
//     () => {
//       const config = vscode.workspace.getConfiguration('faahhSound');
//       const current = config.get<boolean>('enabled', true);
//       config.update('enabled', !current, vscode.ConfigurationTarget.Global);
//       vscode.window.showInformationMessage(
//         `FaahhSound ${!current ? 'enabled 🔊' : 'disabled 🔇'}`
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
import * as cp from 'child_process';

let previousErrorCount = 0;
let diagnosticListener: vscode.Disposable | undefined;

// Play the faahh sound using Mac's built-in afplay
function playFahh(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('faahhSound');
  const enabled = config.get<boolean>('enabled', true);

  if (!enabled) return;

  const soundPath = path.join(context.extensionPath, 'sounds', 'fahhhhh.mp3');

  try {
    cp.spawn('afplay', [soundPath], { detached: true }).unref();
  } catch (err) {
    console.error('FaahhSound: Could not play sound:', err);
  }
}

// Count errors (and optionally warnings) across all open files
function countProblems(): number {
  const config = vscode.workspace.getConfiguration('faahhSound');
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
  console.log('FaahhSound is now active!');

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
    'faahhSound.testSound',
    () => {
      vscode.window.showInformationMessage('Testing faahh sound... 🔊');
      playFahh(context);
    }
  );

  // Register toggle command
  const toggleCommand = vscode.commands.registerCommand(
    'faahhSound.toggle',
    () => {
      const config = vscode.workspace.getConfiguration('faahhSound');
      const current = config.get<boolean>('enabled', true);
      config.update('enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `FaahhSound ${!current ? 'enabled 🔊' : 'disabled 🔇'}`
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