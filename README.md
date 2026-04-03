# Dhagoolka Sound 🔊

> Plays a **"fahhh"** sound every time you make an error in VS Code. Never silently break your code again!

---

## 📦 Installation

### For your company (recommended): install from a `.vsix` file

Share one built `.vsix` with your team (Slack, shared drive, internal Git repo, etc.). **macOS and Windows** are supported; see [Requirements](#-requirements) for details.

**Whoever maintains the extension** — build the package once:

```bash
cd dhagolka-extension   # or your local clone folder name
npm install
npm run vsix
```

That produces `dhagoolka-sound-<version>.vsix` in the project folder (version comes from `package.json`, e.g. `dhagoolka-sound-0.0.1.vsix`).

**Each developer** — install it:

**Visual Studio Code**

1. Extensions sidebar → **⋯** (Views and More Actions) → **Install from VSIX…** → choose the `.vsix` file, **or**
2. Terminal:
   ```bash
   code --install-extension /path/to/dhagoolka-sound-0.0.1.vsix
   ```

**Cursor** (same extension format)

1. Extensions → **⋯** → **Install from VSIX…** → select the file, **or**
2. Terminal (if the `cursor` shell command is installed):
   ```bash
   cursor --install-extension /path/to/dhagoolka-sound-0.0.1.vsix
   ```

Reload the editor when prompted. Use **Dhagoolka Sound: Test Sound 🔊** from the Command Palette to confirm audio works.

**Source code:** [github.com/ENG-MNOR/dhagolka-extension](https://github.com/ENG-MNOR/dhagolka-extension). Maintainers can attach the built `.vsix` to a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) so the team downloads it without running `npm`.

---

### Option 1: Install from Open VSX (public marketplace)

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Windows/Linux)
3. Search for `Dhagoolka Sound`
4. Click **Install**

### Option 2: Quick CLI install (if you already have the `.vsix`)

```bash
code --install-extension dhagoolka-sound-0.0.1.vsix
```

---

## ✨ Features

- 🔊 Plays a sound every time a **new error** appears in your code
- 🔇 Toggle sound **on/off** instantly via Command Palette
- ⚙️ Configurable to trigger on **errors only** or **errors + warnings**
- 🌐 Works with **any language** — TypeScript, JavaScript, Python, and more
- 🚀 Lightweight — no heavy dependencies

---

## 🎮 Commands

Open the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux):

| Command | Description |
|---|---|
| `Dhagoolka Sound: Test Sound 🔊` | Play the sound immediately to test it |
| `Dhagoolka Sound: Toggle On/Off` | Mute or unmute the sound |

---

## ⚙️ Settings

Go to **Settings** (`Cmd+,`) and search for `Dhagoolka Sound`:

| Setting | Type | Default | Description |
|---|---|---|---|
| `dhagoolkaSound.enabled` | boolean | `true` | Enable or disable the sound |
| `dhagoolkaSound.minSeverity` | string | `"error"` | Set to `"error"` or `"warning"` |

### Example `settings.json`
```json
{
  "dhagoolkaSound.enabled": true,
  "dhagoolkaSound.minSeverity": "error"
}
```

---

## 🛠️ Build From Source

Want to build this extension yourself? Follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- [VS Code](https://code.visualstudio.com)
- **macOS** or **Windows** (to run the packaged extension and hear sounds)

### Step 1: Clone or download the project
```bash
git clone https://github.com/ENG-MNOR/dhagolka-extension.git
cd dhagolka-extension
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Add your sound file
Put your MP3 at **`sounds/fahhhhh.mp3`**. The same file is used on **macOS** (`afplay`) and **Windows** (PowerShell + `MediaPlayer`) — nothing else to configure.

**Test on Mac:**

```bash
afplay sounds/fahhhhh.mp3
```

### Step 4: Compile the extension
```bash
npm run compile
```

### Step 5: Package it
```bash
npx @vscode/vsce package --no-dependencies
```
This creates `dhagoolka-sound-0.0.1.vsix` (the version matches `package.json`). `vsce` runs the `vscode:prepublish` script, which builds production assets — you can skip Step 4 if you rely on that alone.

### Step 6: Install it
```bash
code --install-extension dhagoolka-sound-0.0.1.vsix
```

### Step 7: Test it
1. Open any `.ts` file in VS Code
2. Type something wrong:
```typescript
const x: number = "this is wrong";
```
3. You should hear **"fahhhhh"** 🔊

---

## 🐛 Troubleshooting

### No sound playing?
**Check the sound file exists:**

```bash
ls sounds/fahhhhh.mp3
```

**macOS — test the file directly:**

```bash
afplay sounds/fahhhhh.mp3
```

**Windows — test in File Explorer:** double-click `fahhhhh.mp3` and confirm it plays.

**Check the extension is installed:**
```bash
code --list-extensions | grep dhagoolka
```

**Check the extension is active:**
- Open VS Code
- Go to `Help → Toggle Developer Tools → Console`
- Look for `DhagoolkaSound is now active!`

**Test manually via Command Palette:**
```
Cmd+Shift+P → "Dhagoolka Sound: Test Sound 🔊"
```

### VS Code says "damaged app" on Mac?
```bash
sudo xattr -rd com.apple.quarantine "/Applications/Visual Studio Code.app"
```

### `code` command not found on Mac?
In VS Code: `Cmd+Shift+P` → `Shell Command: Install 'code' command in PATH`

Or manually:
```bash
sudo ln -sf "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" /usr/local/bin/code
```

### Sound plays on test command but not on errors?
Make sure your file has TypeScript or a linter enabled so VS Code shows red squiggles. The extension listens for VS Code diagnostics — no squiggles means no sound!

---

## 🏗️ Project Structure

```
dhagolka-extension/   (repo root — npm package name is still dhagoolka-sound)
├── sounds/
│   └── fahhhhh.mp3       ← same file on macOS + Windows
├── src/
│   └── extension.ts      ← main extension logic
├── dist/                 ← compiled output (auto-generated)
├── package.json          ← extension manifest
├── webpack.config.js     ← webpack bundler config
├── tsconfig.json         ← TypeScript config
└── README.md
```

---

## 🔧 How It Works

1. When VS Code starts, the extension **snapshots** the current error count
2. It listens to `vscode.languages.onDidChangeDiagnostics` for any changes
3. If the new error count is **higher** than before → plays the sound
4. **macOS:** plays via `afplay`. **Windows:** plays via `powershell.exe` and WPF `MediaPlayer` (PresentationCore) — no extra apps required beyond a normal desktop Windows install

---

## 📋 Requirements

| Requirement | Details |
|---|---|
| VS Code | `^1.109.0` |
| OS | **macOS** or **Windows** (64-bit desktop) |
| Node.js | `^18.0.0` (for building only) |

> **Linux:** Playback is not implemented yet; only macOS and Windows run the sound. Contributions welcome.

> **Windows note:** If sound never plays, ensure **Windows PowerShell** is available (default on Windows 10/11).

---

## 🐍 Using With Python Files

By default VS Code doesn't show errors in Python files unless you set up a linter. Follow these steps:

### Step 1: Install the Python extension in VS Code
```
Cmd+Shift+X → search "Python" → install Microsoft's Python extension
```

### Step 2: Install pylint or flake8
```bash
pip3 install pylint
# or
pip3 install flake8
```

### Step 3: Enable linting in VS Code settings
Open `settings.json` (`Cmd+Shift+P` → "Open User Settings JSON") and add:
```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

### Step 4: Select your Python interpreter
```
Cmd+Shift+P → "Python: Select Interpreter" → choose your Python version
```

### Step 5: Create a test Python file
```bash
touch test.py
code test.py
```

### Step 6: Type a Python error and save
```python
x: int = "this is not a number"
y: str = 123

def greet(name: str) -> int:
    return name  # wrong return type
```

Save the file (`Cmd+S`) — red squiggles will appear and you should hear **"fahhhhh"** 🔊

> **Note:** Python linting may take 1-2 seconds after saving to show errors, unlike TypeScript which is instant.

---

## 🚀 Publishing to Open VSX (using GitHub)

Open VSX is an open source VS Code extension marketplace that uses GitHub login — no Microsoft account needed!

### Step 1: Create a GitHub account
Go to **https://github.com** and sign up if you don't have one.

### Step 2: Create an Open VSX account
1. Go to **https://open-vsx.org**
2. Click **Sign in with GitHub**
3. Authorize Open VSX to access your GitHub account

### Step 3: Create a namespace
1. After signing in, go to:
   ```
   https://open-vsx.org/user-settings/namespaces
   ```
2. Click **Add Namespace**
3. Enter your namespace name (e.g. `pavithra-dev`) — this must match the `publisher` field in your `package.json`
4. Click **Add**

### Step 4: Get your Open VSX access token
1. Go to:
   ```
   https://open-vsx.org/user-settings/tokens
   ```
2. Click **Generate New Token**
3. Give it a name (e.g. `publish`)
4. Click **Generate**
5. **Copy the token immediately** — you won't see it again!

### Step 5: Make sure package.json has your publisher
Open `package.json` and add:
```json
{
  "publisher": "your-namespace-here",
  "license": "MIT",
  ...
}
```

### Step 6: Add a LICENSE file
```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### Step 7: Sign the Eclipse Foundation Publisher Agreement
1. Go to **https://open-vsx.org/user-settings/namespaces**
2. Click on your namespace
3. Click **Sign Publisher Agreement**
4. Fill in your details and sign (it's free!)

### Step 8: Package the extension
```bash
cd your-extension-folder
npx @vscode/vsce package --no-dependencies
```
This creates `dhagoolka-sound-0.0.1.vsix`

### Step 9: Publish!
```bash
npx ovsx publish dhagoolka-sound-0.0.1.vsix -p YOUR_TOKEN_HERE
```

### Step 10: Verify it's live
Go to:
```
https://open-vsx.org/extension/your-namespace/dhagoolka-sound
```

> **Note:** Your extension may show as inactive until your namespace is verified. To request verification, open a GitHub issue at:
> ```
> https://github.com/EclipseFdn/open-vsx.org/issues/new?template=add-namespace-owner.md
> ```
> Include your GitHub username and namespace name. Usually approved within a few hours!

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b my-feature`
3. Make your changes
4. Compile: `npm run compile`
5. Test: `Run → Start Debugging`
6. Submit a pull request!

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👩‍💻 Author

Made with 😤 and **"fahhhhh"** by Pavithra

---

*If this extension made you laugh while fixing bugs, give it a ⭐ on GitHub!*