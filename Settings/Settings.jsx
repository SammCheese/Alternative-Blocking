// One of my first react components
const { React, getModule } = require("powercord/webpack");
const {
  Category,
  TextInput,
} = require("powercord/components/settings");
const { FormTitle, Button } = require("powercord/components");
const CategoryImg = require("./CategoryImg");
const path = require("path");

var blocked = [];
module.exports = class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.plugin =
      powercord.pluginManager.get("test-plugin") ||
      powercord.pluginManager.get("test-plugin-master");
    this.state = {};
    this.state.currentId = "000000000000000000";
    this.listOpened = false;
  }

  info = getModule(["getUser"], false).getUser;

  addNewUser() {
    blocked.push({
      open: false,
      id: "000000000000000000",
      content: "x3",
      name: "INVALID USER",
      pfp: "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
    });
    return blocked;
  }
  removeUser(i) {
    blocked.splice(i, 1);
    return blocked;
  }
  updateUserId(i, id, name, pfp) {
    blocked[i].id = id;
    blocked[i].name = name;
    blocked[i].pfp = pfp;
    return blocked;
  }
  updateUserReplacement(i, content) {
    blocked[i].content = content;
    return blocked;
  }
  toggle(i, val) {
    blocked[i].open = val;
    return blocked;
  }
  updateUserPreviews() {
    blocked.map((user, i) => {
      var p = user.id;
      this.info(p.toString())
        .then((res) => {
          this.props.updateSetting(
            "blockedUsers",
            this.updateUserId(i, p, res.username,
              'https://cdn.discordapp.com/avatars/'+res.id+'/'+res.avatar+'.webp?size=256')
          );
        })
        .catch((err) => {
          if (err) {
            this.props.updateSetting(
              "blockedUsers",
              this.updateUserId(
                i,
                p,
                "INVALID USER",
                "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
              )
            );
          }
        });
    });
  }

  componentWillUnmount() { // this is terrible, but it will work for now
    setTimeout(() => {powercord.pluginManager.remount('Alternative-Blocking')}, 1000);
  }

  render() {
    const { getSetting, updateSetting } = this.props;
    blocked = getSetting("blockedUsers");
    if (!blocked) {
      blocked = [];
      updateSetting("blockedUsers", blocked);
    }
    return (
      <div>
        <div>
          <FormTitle style={{ color: "lightgrey", "margin-top": "10px" }}>"Block" users here!</FormTitle>
          <Category
            name="Users"
            description="Manage Blocked Users"
            opened={this.state.listOpened}
            onChange={(p) => {
              this.updateUserPreviews();
              this.setState({ listOpened: p });
            }}
          >
            {blocked.map((user, i) => (
              <div>
                <CategoryImg
                  image={user.pfp}
                  name={user.name}
                  opened={user.open}
                  onChange={(p) => {
                    updateSetting("blockedUsers", this.toggle(i, p));
                  }}
                >
                  <h1 style={{ color: "lightgrey", "margin-bottom": "12px" }}>
                    Basic Configuration
                  </h1>
                  <TextInput
                    defaultValue={user.id}
                    onChange={(p) => {
                      if (p.length > 18) {
                        updateSetting(
                          "blockedUsers",
                          this.updateUserId(i, p.substring(0, 18))
                        );
                        return;
                      }
                      this.info(p.toString())
                        .then((res) => {
                          updateSetting(
                            "blockedUsers",
                            this.updateUserId(i, p, res.username, res.avatarURL)
                          );
                        })
                        .catch((err) => {
                          if (err) {
                            updateSetting(
                              "blockedUsers",
                              this.updateUserId(
                                i,
                                p,
                                "INVALID USER",
                                "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
                              )
                            );
                          }
                        });
                    }}
                  >
                    Set User ID
                  </TextInput>
                  <TextInput
                    defaultValue={user.content}
                    onChange={(p) => {
                      updateSetting(
                        "blockedUsers",
                        this.updateUserReplacement(i, p)
                      );
                    }}
                  >
                    Set User Message Replacement
                  </TextInput>

                  <Button
                    color={Button.Colors.RED}
                    onClick={() => {
                      updateSetting("blockedUsers", this.removeUser(i));
                    }}
                  >
                    Remove User
                  </Button>
                </CategoryImg>
              </div>
            ))}
            <Button
              onClick={() => {
                updateSetting("blockedUsers", this.addNewUser());
              }}
            >
              Add New User
            </Button>
          </Category>
        </div>
      </div>
    );
  }
};
