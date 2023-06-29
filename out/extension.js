"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.createReusableFolder", async (uri) => {
        const componentName = await vscode.window.showInputBox({
            placeHolder: "Enter the component name.",
        });
        if (!componentName) {
            return;
        }
        const dirPath = path.join(uri.fsPath, componentName);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        const indexContent = `
		import React from 'react';
		import Styled${componentName} from './components/Styled${componentName}';

		interface ${componentName}Props {
		layoutVariant: string;
		}

		const ${componentName} = ({ layoutVariant }: ${componentName}Props) => {
		return <Styled${componentName} layoutVariant={layoutVariant}>
			${componentName}
		</Styled${componentName}>;
		};

		export default ${componentName};
        `;
        const styleContent = `
 			export { default } from './${componentName}';
		`;
        fs.writeFileSync(path.join(dirPath, `${componentName}.tsx`), indexContent);
        fs.writeFileSync(path.join(dirPath, `index.ts`), styleContent);
        // Create styles folder and file
        const stylesDirPath = path.join(dirPath, "components");
        if (!fs.existsSync(stylesDirPath)) {
            fs.mkdirSync(stylesDirPath);
        }
        const stylesContent = `
			import { StyledComponentProps } from '@flex-platform/shared-types';
			import styled from 'styled-components';

			const Styled${componentName} = styled.div<StyledComponentProps>\`
			// ==========================================================================
			// Global
			// ==========================================================================

			// ==========================================================================
			// Mobile
			// ==========================================================================
			\${({ theme }) => theme.mediaQueries.mobile} {
			}

			// ==========================================================================
			// Mobile Large
			// ==========================================================================
			\${({ theme }) => theme.mediaQueries.mobileLarge} {
			}

			// ==========================================================================
			// Tablet
			// ==========================================================================
			\${({ theme }) => theme.mediaQueries.tablet} {
			}

			// ==========================================================================
			// Desktop
			// ==========================================================================
			\${({ theme }) => theme.mediaQueries.desktop} {
			}

			// ==========================================================================
			// widescreen
			// ==========================================================================
			\${({ theme }) => theme.mediaQueries.widescreen} {
			}
			\`;

			export default Styled${componentName};
		`;
        fs.writeFileSync(path.join(stylesDirPath, `Styled${componentName}.ts`), stylesContent);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map