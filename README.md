# AI-BGRemover 🖼️

[![React Version](https://img.shields.io/badge/React-18-brightgreen)](https://reactjs.org) 
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.1-blue)](https://www.typescriptlang.org/) 
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

**AI-BGRemover** (aka **BGPro**) is a **practice/demo AI project** for removing image backgrounds.  
It runs **entirely in your browser**, using local AI processing for **100% privacy**, perfect for small AI micro-projects and content creation.  
> ⚠️ **Note:** This project is for learning and content purposes only. Not a production-ready app.

---

## 🌟 Key Features

- 🚀 **Auto-Processing:** Instantly removes backgrounds when images are uploaded  
- 🔒 **Fully Private:** Images never leave your browser; all processing happens locally using WASM + ONNX  
- ⚡ **Hardware Accelerated:** Uses WebGPU (fallback to WebGL/CPU) for maximum speed  
- 💎 **Premium UI:** Modern glassmorphism-inspired interface on a single screen  
- 🖼️ **High Resolution:** Supports high-fidelity outputs for professional-looking images  

---

## 🛠️ Technology Stack

- **Framework:** React 18 + TypeScript  
- **Styling:** Tailwind CSS  
- **AI Engine:** [@imgly/background-removal](https://github.com/imgly/background-removal-js)  
- **Runtime:** [onnxruntime-web](https://github.com/microsoft/onnxruntime) – GPU/WebGL/CPU fallback  
- **Icons:** [Lucide React](https://lucide.dev/)  
- **Build Tool:** Vite  

---

## ⚙️ Installation & Usage

```bash
# Clone the repository
git clone https://github.com/mhamza1125/AI-BGRemover.git
cd AI-BGRemover

# Install dependencies
npm install

# Run the development server
npm run dev

# Open your browser at http://localhost:5173 to see the app in action

# Create a production build
npm run build

# The output is in the 'dist' folder, ready for hosting (Vercel, Netlify, etc.)
```

---

## ⚙️ How It Works

```bash
# 1. Upload an image to the app
# 2. AI engine runs locally via onnxruntime-web
# 3. Background is removed instantly
# 4. Download the processed image for testing or content creation
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📫 Contact

```bash
Email: mhamza1125@gmail.com
LinkedIn: https://www.linkedin.com/in/mhamza1125/
```
