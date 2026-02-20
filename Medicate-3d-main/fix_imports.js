const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'components', 'ui');

function walk(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const filepath = path.join(dir, file);
            fs.stat(filepath, (err, stats) => {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile() && file.endsWith('.tsx')) {
                    callback(filepath);
                }
            });
        });
    });
}

function removeVersionFromImports(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Regex to match imports with version numbers (e.g., @1.2.3)
        // It looks for patterns like: from 'package-name@1.2.3'
        // or import { ... } from "package-name@1.2.3"
        // We want to remove the @version part.

        // This regex handles scoped packages (@radix-ui/...) and regular ones, ending with optional version
        const regex = /from\s+['"]([^'"]+)@\d+\.\d+\.\d+['"]/g;

        let fileChanged = false;
        const newData = data.replace(regex, (match, p1) => {
            fileChanged = true;
            return `from '${p1}'`;
        });

        if (fileChanged) {
            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file ${filePath}:`, err);
                } else {
                    console.log(`Updated imports in: ${filePath}`);
                }
            });
        }
    });
}

console.log('Starting to fix imports in src/components/ui...');
walk(directoryPath, removeVersionFromImports);
