#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

async function syncKeyOrder() {
    try {
        const config = JSON.parse(await readFile('.i18ncheckrc.json', 'utf8'));
        
        // Support both old and new config formats
        const filesToSync = Array.isArray(config.files) && typeof config.files[0] === 'object' 
            ? config.files.filter(f => !f.excludeFromSync)
            : config.files.map(path => ({ path }));
        
        if (filesToSync.length < 2) {
            console.log('❌ Need at least 2 files to sync key order');
            return;
        }
        
        // Read all files
        const filesData = {};
        for (const fileConfig of filesToSync) {
            const data = JSON.parse(await readFile(fileConfig.path, 'utf8'));
            filesData[fileConfig.path] = data;
        }
        
        // Use first file as reference for key order
        const referenceFile = filesToSync[0].path;
        const referenceKeys = Object.keys(filesData[referenceFile]);
        
        console.log(`📋 Using ${referenceFile} as reference for key order`);
        console.log(`🔄 Syncing ${filesToSync.length - 1} other files...\n`);
        
        // Sync other files to match reference order
        for (let i = 1; i < filesToSync.length; i++) {
            const targetFile = filesToSync[i].path;
            const targetData = filesData[targetFile];
            const syncedData = {};
            
            // Add keys in reference order
            for (const key of referenceKeys) {
                if (key in targetData) {
                    syncedData[key] = targetData[key];
                }
            }
            
            // Add any extra keys that don't exist in reference
            for (const key in targetData) {
                if (!(key in syncedData)) {
                    syncedData[key] = targetData[key];
                }
            }
            
            // Write back to file
            await writeFile(targetFile, JSON.stringify(syncedData, null, 2) + '\n');
            console.log(`✅ Synced: ${targetFile}`);
        }
        
        console.log('\n🎉 Key order synchronization completed!');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

syncKeyOrder();