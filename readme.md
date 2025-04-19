# JSX Parser

**A powerful toolchain for parsing JSX to JSON and reversing JSON back to JSX.** Built using Next.js 15, React, Motion, Babel, and Commander, this project provides a seamless developer experience for transforming JSX code for various use cases like rendering optimization, serialization, or UI building tools.

---

## ✨ Features

- ⚛️ **JSX to JSON transformation** using Babel and custom plugins — Easily convert JSX code into JSON for various optimizations and use cases.
- 🔁 **JSON to JSX reverse conversion** — Supports nesting and ensures the output is valid JSX for further use.
- 💨 **Interactive frontend** built with Next.js 15 and Motion — Smooth animations and an easy-to-use interface for parsing.
- 📦 **CLI support via Commander** — Automate and batch process JSX/JSON conversions or integrate into scripts.

---

## 📦 Tech Stack

| Technology                                           | Purpose                                          |
| ---------------------------------------------------- | ------------------------------------------------ |
| [Next.js 15](https://nextjs.org/)                    | Frontend framework for building web applications |
| [React](https://react.dev/)                          | UI components for building interactive UIs       |
| [Motion](https://motion.dev/)                        | Smooth transition library for animations         |
| [Commander](https://www.npmjs.com/package/commander) | CLI tool creation and scripting                  |

---

## 🚀 Getting Started

Make sure you have **Node.js**, **Bun** and **pnpm** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/mahdiitaheri/jsx-parser.git
cd jsx-parser
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Development Server

```bash
pnpm run dev
```

Visit http://localhost:3000 to view the parser UI.

## 🔧 Usage

### JSX to JSON

**Using Web Interface:**

1. Visit the running server at http://localhost:3000.
2. Input your JSX code in the provided form.
3. Get the converted JSON output instantly.

```bash
bun run jsxToJson
```

### JSON TO JSX

```bash
bun run jsonToJsx
```

Also you can use :all or :watch flags to either parse all files or keep cli in watch mode

## 🤝 Contributing

Contributions are welcome! Follow these steps to get started:

1. Fork the repo
2. Clone your fork:

```bash
git clone https://github.com/mahdiitaheri/jsx-parser.git
```

3. Create a new branch:

```bash
git checkout -b feature/my-feature
```

4. Make your changes and commit them:

```bash
git commit -am 'Add feature'
```

5. Push to your branch:

```bash
git push origin feature/my-feature
```

6. Open a Pull Request (PR) to the main repository

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or suggestions, feel free to open an issue or reach out via:

**GitHub:** [@mahdiitaheri](https://github.com/MahdiiTaheri/jsx-parser)
