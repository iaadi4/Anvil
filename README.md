# Anvil - Web Application Bootstrapper

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/Next.js-15.x-black.svg" alt="Next.js">
</p>

<p align="center">
  A powerful CLI tool for rapidly bootstrapping modern web applications with best-in-class tooling and configurations.
  
  We are excited to make Anvil open-source and invite developers from around the world to contribute, share, and innovate on this platform!
</p>

## 🚀 Overview

Anvil is a comprehensive project bootstrapping tool designed to streamline the setup process for web applications. It offers an interactive CLI experience to configure your project with the frameworks and tools you need, eliminating the hassle of manual setup and configuration.

## ✨ Features

- 🔧 **Interactive Setup**: User-friendly CLI prompts guide you through project creation
- 🛠️ **Multiple Frameworks**: Support for React and Next.js with TypeScript
- 🎨 **Styling Options**: Seamless integration with Tailwind CSS, Shadcn UI, and DaisyUI
- 🔒 **Authentication**: Easy setup with Clerk and other auth providers
- 🗄️ **Database Integration**: ORM support with Prisma and Drizzle
- 📦 **Package Manager Choice**: Use npm, yarn, or pnpm
- 🧩 **Extensible**: Add Docker and other tools to your project

## 📋 Project Structure

The repository consists of two main components:

- **anvil-cli**: The command-line interface tool that generates new projects
- **anvil-web**: The web interface (dashboard) for the Anvil tool

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/iaadi4/anvil.git
cd anvil

# Install dependencies
cd anvil-web
pnpm install

# Build the CLI
cd anvil-cli
pnpm install

# (Optional) Link globally to use from anywhere
npm link
```

## 🚀 Usage

### Using the CLI

```bash
# If linked globally
create-anvil

# Or run directly from the project
cd anvil/anvil-cli
pnpm build
pnpm create-anvil
```

Follow the interactive prompts to configure your project:

1. Enter a project directory name
2. Select a framework (React or Next.js with TypeScript)
3. Choose styling options (Tailwind CSS, Shadcn UI, DaisyUI)
4. Add authentication providers
5. Select additional tools and libraries


## 🛠️ Available Configurations

### Frameworks
- React with TypeScript
- Next.js with TypeScript

### Styling Options
- Tailwind CSS
- Shadcn UI (requires Tailwind and TypeScript)
- DaisyUI (requires Tailwind)

### Authentication Providers
- Better-auth
- Clerk
- NextAuth (when using Next.js)

### ORM Options
- Prisma
- Drizzle

### Package Managers
- npm
- yarn
- pnpm

## 🧩 Extending Anvil

Anvil is designed to be extensible. You can add new templates, frameworks, or tools by modifying the source files in the `anvil-cli/templates` directory and updating the corresponding constants in `anvil-cli/src/constants`.

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). We chose this license to encourage collaboration and contributions from the broader community.

## 🤝 Contributing

We warmly welcome contributions from the community! Please follow these steps to contribute:

1. **Fork the repository**
2. **Create your feature branch**: (`git checkout -b feature/amazing-feature`)
3. **Commit your changes**: (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch**: (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please include clear descriptions of your changes and related issues if applicable. If you have suggestions for improving the project structure or documentation, we would love to hear from you! Additionally, feel free to reach out with ideas for new features or enhancements.

We encourage you to read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards before contributing.

## 📞 Support

If you encounter any issues or have questions, please [file an issue](https://github.com/yourusername/anvil/issues/new) on the GitHub repository.

## 🌟 Open Source

Anvil is proudly open source and community-driven. We believe in the power of collaboration and shared knowledge to create better tools for developers worldwide. Here's how we embrace open source principles:

- **Transparency**: Our development process, roadmap, and decision-making are open for all to see
- **Inclusivity**: We welcome contributors of all skill levels and backgrounds
- **Quality**: We maintain high standards through peer review and automated testing
- **Sustainability**: We're committed to the long-term maintenance of this project

### Future Roadmap

Our vision for Anvil includes:

- Supporting more frameworks and technologies
- Adding intelligent project scaffolding based on best practices
- Improving the web interface with more customization options
- Creating a plugin ecosystem for community-built extensions

We invite you to join us in shaping the future of Anvil!

---

<p align="center">Built with ❤️ for modern web developers</p>
