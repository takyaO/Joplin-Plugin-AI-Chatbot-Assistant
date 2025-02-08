import joplin from 'api';
import { ChangeEvent } from 'api/JoplinSettings';
import { MenuItemLocation } from 'api/types';
import { SettingItemType } from 'api/types';

joplin.plugins.register({
    onStart: async function() {
        await joplin.settings.onChange(async (event: ChangeEvent) => {
            alert('Please restart Joplin');
        });

        // Define settings for the plugin
        await joplin.settings.registerSection('Chat_GPT_Search', {
            label: 'AI Chatbot Assistant',
        });
        await joplin.settings.registerSettings({
            // General settings
            'GPTSearchURL': {
                value: 'http://localhost:3000/',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Base URL (e.g., https://chatgpt.com)',
            },
            'GPTSearchModel': {
                value: 'deepseek-r1:8b',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Model (e.g., gpt-4o)',
            },
            'GPTSearchParams': {
                value: 'temporary-chat=true',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Additional Parameters (e.g., temporary-chat=true&web-search=true)',
            },

            // Settings for Command 1
            'GPTSearchCommand1': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '1',
            },
            'GPTSearchLabelExplain': {
                value: 'Explain',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 1 Name',
            },
            'GPTSearchKeywordExplain': {
                value: 'Explain: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 1 Keyword',
            },

            // Settings for Command 2
            'GPTSearchCommand2': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '2',
            },
            'GPTSearchLabelWhatIs': {
                value: 'Proofread',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 2 Name',
            },
            'GPTSearchKeywordWhatIs': {
                value: 'Proofread for grammar and clarity: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 2 Keyword',
            },

            // Settings for Command 3
            'GPTSearchCommand3': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '3',
            },
            'GPTSearchLabelSummary': {
                value: 'Summarize',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 3 Name',
            },
            'GPTSearchKeywordSummary': {
                value: 'Summarize: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 3 Keyword',
            },

            // Settings for Command 4
            'GPTSearchCommand4': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '4',
            },
            'GPTSearchLabelDefine': {
                value: 'Translation',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 4 Name',
            },
            'GPTSearchKeywordDefine': {
                value: 'Translate to Japanese: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 4 Keyword',
            },

            // Settings for Command 5
            'GPTSearchCommand5': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '5',
            },
            'GPTSearchLabelRelated': {
                value: 'Find related info',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 5 Name',
            },
            'GPTSearchKeywordRelated': {
                value: 'Find info related to: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 5 Keyword',
            },

            // Settings for Command 6
            'GPTSearchCommand6': {
                value: 1,
                type: SettingItemType.Bool,
                section: 'Chat_GPT_Search',
                public: true,
                label: '6',
            },
            'GPTSearchLabelRephrase': {
                value: 'Rephrase',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 6 Name',
            },
            'GPTSearchKeywordRephrase': {
                value: 'Rephrase while keeping the core message intact: ',
                type: SettingItemType.String,
                section: 'Chat_GPT_Search',
                public: true,
                label: 'Command 6 Keyword',
            },
       });

        // Function to perform search based on keyword and selected text
        async function performSearch(keyword: string) {
            const selectedText = await joplin.commands.execute('selectedText');
            if (selectedText) {
                const query = encodeURIComponent(`${keyword} ${selectedText}`);
                let url = `${await joplin.settings.value('GPTSearchURL')}?model=${await joplin.settings.value('GPTSearchModel')}&q=${query}`;

                // Add additional parameters if provided
                const params = await joplin.settings.value('GPTSearchParams');
                if (params) {
                    url += `&${params}`;
                }

                console.info(`Opening URL: ${url}`);
                await joplin.commands.execute('openItem', url);
            } else {
                await joplin.views.dialogs.showMessageBox('No text selected to search.');
            }
        }

        // Register commands based on settings
        const commands = [
            { name: 'gptExplain', commandSetting: 'GPTSearchCommand1', labelSetting: 'GPTSearchLabelExplain', keywordSetting: 'GPTSearchKeywordExplain' },
            { name: 'gptWhatIs', commandSetting: 'GPTSearchCommand2', labelSetting: 'GPTSearchLabelWhatIs', keywordSetting: 'GPTSearchKeywordWhatIs' },
            { name: 'gptSummary', commandSetting: 'GPTSearchCommand3', labelSetting: 'GPTSearchLabelSummary', keywordSetting: 'GPTSearchKeywordSummary' },
            { name: 'gptDefine', commandSetting: 'GPTSearchCommand4', labelSetting: 'GPTSearchLabelDefine', keywordSetting: 'GPTSearchKeywordDefine' },
            { name: 'gptRelated', commandSetting: 'GPTSearchCommand5', labelSetting: 'GPTSearchLabelRelated', keywordSetting: 'GPTSearchKeywordRelated' },
            { name: 'gptRephrase', commandSetting: 'GPTSearchCommand6', labelSetting: 'GPTSearchLabelRephrase', keywordSetting: 'GPTSearchKeywordRephrase' },
        ];
        for (const command of commands) {
            // Register command
            await joplin.commands.register({
                name: command.name,
                label: await joplin.settings.value(command.labelSetting),
                execute: async () => {
                    const keyword = await joplin.settings.value(command.keywordSetting);
                    await performSearch(keyword);
                },
            });
            // Check if the command should be shown based on settings
            const showCommand = await joplin.settings.value(command.commandSetting);
            if (showCommand) {
                await joplin.views.menuItems.create(
                    `GPTSearch_${command.name}`,
                    command.name,
                    MenuItemLocation.EditorContextMenu
                );
            }
        }
    },
});