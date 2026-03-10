# FaahhSound 🔊

> Plays a **"fahhh"** sound every time you make an error in VS Code. Never silently break your code again!

---

## 📦 Installation

### Option 1: Install from Open VSX
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Windows/Linux)
3. Search for `FaahhSound`
4. Click **Install**

### Option 2: Install manually from `.vsix`
```bash
code --install-extension faahh-sound-0.0.1.vsix
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
| `Faahh Sound: Test Sound 🔊` | Play the sound immediately to test it |
| `Faahh Sound: Toggle On/Off` | Mute or unmute the sound |

---

## ⚙️ Settings

Go to **Settings** (`Cmd+,`) and search for `FaahhSound`:

| Setting | Type | Default | Description |
|---|---|---|---|
| `faahhSound.enabled` | boolean | `true` | Enable or disable the sound |
| `faahhSound.minSeverity` | string | `"error"` | Set to `"error"` or `"warning"` |

### Example `settings.json`
```json
{
  "faahhSound.enabled": true,
  "faahhSound.minSeverity": "error"
}
```

---

## 🛠️ Build From Source

Want to build this extension yourself? Follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- [VS Code](https://code.visualstudio.com)
- Mac (uses built-in `afplay` for audio)

### Step 1: Clone or download the project
```bash
git clone https://github.com/your-username/faahh-sound.git
cd faahh-sound
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Add your sound file
- Record yourself saying **"fahhh"** or download any mp3
- Place it at `sounds/fahhhhh.mp3`
- Test it works:
```bash
afplay sounds/fahhhhh.mp3
```

### Step 4: Compile the extension
```bash
npm run compile
```

### Step 5: Package it
```bash
npx vsce package --no-dependencies
```
This creates `faahh-sound-0.0.1.vsix`

### Step 6: Install it
```bash
code --install-extension faahh-sound-0.0.1.vsix
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

**Test the sound file directly:**
```bash
afplay sounds/fahhhhh.mp3
```

**Check the extension is installed:**
```bash
code --list-extensions | grep faahh
```

**Check the extension is active:**
- Open VS Code
- Go to `Help → Toggle Developer Tools → Console`
- Look for `FaahhSound is now active!`

**Test manually via Command Palette:**
```
Cmd+Shift+P → "Faahh Sound: Test Sound 🔊"
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
faahh-sound/
├── sounds/
│   └── fahhhhh.mp3       ← your sound file
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
4. Uses Mac's built-in `afplay` command to play the `.mp3` file — no external dependencies!

---

## 📋 Requirements

| Requirement | Details |
|---|---|
| VS Code | `^1.109.0` |
| OS | macOS (uses `afplay`) |
| Node.js | `^18.0.0` (for building only) |

> **Windows/Linux users:** The extension currently uses `afplay` which is Mac-only. To support other platforms, replace `afplay` with `powershell` (Windows) or `mpg123` (Linux) in `src/extension.ts`.

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
npx vsce package --no-dependencies
```
This creates `faahh-sound-0.0.1.vsix`

### Step 9: Publish!
```bash
npx ovsx publish faahh-sound-0.0.1.vsix -p YOUR_TOKEN_HERE
```

### Step 10: Verify it's live
Go to:
```
https://open-vsx.org/extension/your-namespace/faahh-sound
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