const { Plugin } = require('powercord/entities');
const fs = require('fs');

const Settings = require('./Settings/Settings')

module.exports = class alternativeBlocking extends Plugin {
  async startPlugin() {
    powercord.api.settings.registerSettings(this.entityID, {
      label: 'Alternative Block',
      category: this.entityID,
      render: Settings
    });

    var blocked = this.settings.get("blockedUsers", "000000000000000000")
    var res = [];
    blocked.map((user) => {
      var css = `[data-author-id="${user.id}"] .markup-eYLPri.messageContent-2t3eCI{
        visibility: hidden;
      }
    
      [data-author-id="${user.id}"] .markup-eYLPri.messageContent-2t3eCI:before{
        visibility: visible;
        content: "${user.content}";
      }\n`
      res.push(css)
    })
    fs.writeFileSync('./styles.css', res.join('\n').toString());
    this.loadStylesheet("./styles.css")
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings(this.entityID);
  }
}