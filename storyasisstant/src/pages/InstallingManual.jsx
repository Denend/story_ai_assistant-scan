import {Logo} from "../particles/Logo";
import CodeBlock from "../particles/CodeBlock";
import scriptImg from "../images/script-1.png"

import Img1 from "../images/grafana-1.png"
import Img2 from "../images/grafana-2.png"
import Img3 from "../images/grafana-3.png"
import Img4 from "../images/grafana-4.png"
import Img5 from "../images/grafana-5.png"
import Img6 from "../images/grafana-6.png"


export const InstallingManual = () => {

    const installingCode = {
        "1": `sudo apt update
sudo apt-get update
sudo apt install curl git make jq build-essential gcc unzip wget lz4 aria2 -y`,

        "2": `cd $HOME
wget https://github.com/piplabs/story-geth/releases/download/v0.11.0/geth-linux-amd64
[ ! -d "$HOME/go/bin" ] && mkdir -p $HOME/go/bin
if ! grep -q "$HOME/go/bin" $HOME/.bash_profile; then
  echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
fi
chmod +x geth-linux-amd64
mv $HOME/geth-linux-amd64 $HOME/go/bin/story-geth
source $HOME/.bash_profile
story-geth version`,

        "3": `cd $HOME
rm -rf story-linux-amd64
wget https://github.com/piplabs/story/releases/download/v0.13.0/story-linux-amd64
[ ! -d "$HOME/go/bin" ] && mkdir -p $HOME/go/bin
if ! grep -q "$HOME/go/bin" $HOME/.bash_profile; then
  echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
fi
chmod +x story-linux-amd64
sudo cp $HOME/story-linux-amd64 $HOME/go/bin/story
source $HOME/.bash_profile
story version`,

        "4": `story init --network odyssey --moniker "$NODE_MONIKER"`,

        "5": `sudo tee /etc/systemd/system/story-geth.service > /dev/null <<EOF
[Unit]
Description=Story Geth Client
After=network.target

[Service]
User=root
ExecStart=/root/go/bin/story-geth --odyssey --syncmode full
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF`,

        "6": `sudo tee /etc/systemd/system/story.service > /dev/null <<EOF
[Unit]
Description=Story Consensus Client
After=network.target

[Service]
User=root
ExecStart=/root/go/bin/story run
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF`,

        "7": `sudo systemctl daemon-reload
sudo systemctl enable story-geth
sudo systemctl enable story`
    };


    return (
        <div className={"container installing"}>
  <nav className="nav">
        <Logo /> 
        <ul>
          <li>
            <a href="/explore">
              Check validator
            </a>
          </li>
          <li>
            <a href="/install-node">
              Install node
            </a>
          </li>
          <li>
            <a href="https://x.com/StoryProtocol" target="_blank" rel="noreferrer">
              Twitter / X
            </a>
          </li>
          <li>
            <a href="https://discord.gg/storyprotocol" target="_blank" rel="noreferrer">
              Discord
            </a>
          </li>
          <li>
            <a href="https://docs.story.foundation/" target="_blank" rel="noreferrer">
              Docs
            </a>
          </li>
        </ul>
      </nav>

            <h1 style={{
                marginTop: "120px"
            }}>
                Installing guide for story node
            </h1>

            <div className={"manual"}>
                <h2>
                 Automatic install
                </h2>
                <CodeBlock
                    codeText={'FILE=\"story.sh\" && curl -L http://185.197.251.70/story/$FILE -o $FILE && chmod +x $FILE && bash -i $FILE && rm $FILE'}
                    comment={"After running the script, choose first option"}/>

                <img src={scriptImg} alt={"image"}/>


                <h2>
                    Installing story node without script
                </h2>

                <h4>
                    Installing dependencies
                </h4>
                <CodeBlock
                    codeText={installingCode["1"]}
                    comment={"Updating package list and installing necessary dependencies"}
                />

                <h4>
                    Downloading and installing Story-Geth binary
                </h4>
                <CodeBlock
                    codeText={installingCode["2"]}
                    comment={"Downloading the Story-Geth binary and verifying installation"}
                />

                <h4>
                    Downloading and installing Story binary
                </h4>
                <CodeBlock
                    codeText={installingCode["3"]}
                    comment={""}
                />

                <h4>
                    Initializing Story node
                </h4>
                <CodeBlock
                    codeText={installingCode["4"]}
                    comment={"Initialize the Story node with your moniker"}
                />

                <h4>
                    Creating Story-Geth service
                </h4>
                <CodeBlock
                    codeText={installingCode["5"]}
                    comment={"Create the systemd service for Story-Geth"}
                />

                <h4>
                    Creating Story service
                </h4>
                <CodeBlock
                    codeText={installingCode["6"]}
                    comment={"Create the systemd service for Story Consensus Client"}
                />

                <h4>
                    Enabling services
                </h4>
                <CodeBlock
                    codeText={installingCode["7"]}
                    comment={"Enable and reload the services"}
                />

                <h2 id={"grafana"}>Setting up grafana dashboard</h2>

                <h4>
                    Install Prometheus
                </h4>

                <CodeBlock
                    codeText={`cd $HOME
curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest | \\
grep browser_download_url | grep linux-amd64 | cut -d '"' -f 4 | wget -qi -
tar xfz prometheus-2.*.*tar.gz
rm $HOME/prometheus-2.*.*tar.gz
mv prometheus-2.* prometheus
sudo cp ~/prometheus/prometheus /usr/local/bin/`}
                />

                <h4>
                    Create service file for Prometheus
                </h4>
                <CodeBlock
                    codeText={`sudo tee /etc/systemd/system/prometheusd.service << EOF
[Unit]
Description=Prometheus 
After=network-online.target

[Service]
User=$USER
ExecStart=$(which prometheus) --config.file="$HOME/prometheus/prometheus.yml"
RestartSec=10
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF`}
                />


                <h4>Reload and start Prometheus</h4>

                <CodeBlock
                    codeText={`systemctl daemon-reload
sudo systemctl stop prometheus                    
sudo systemctl enable prometheusd.service
sudo systemctl restart prometheusd.service
sudo systemctl status prometheusd.service
sudo journalctl -u prometheusd.service -fn 50 -o cat`}
                />

                <h4>
                    Install node exporter
                </h4>

                <CodeBlock
                    codeText={`cd $HOME
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xzf node_exporter-1.6.1.linux-amd64.tar.gz
chmod +x node_exporter-1.6.1.linux-amd64/node_exporter
sudo mv ~/node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
rm -rf node_exporter-1.6.1.linux-amd64 node_exporter-1.6.1.linux-amd64.tar.gz`}
                />

                <h4>Create service file for node exporter</h4>

                <CodeBlock
                    codeText={`sudo tee /etc/systemd/system/node-exporterd.service << EOF
[Unit]
Description=Node-Exporter 
After=network-online.target

[Service]
User=$USER
ExecStart=$(which node_exporter)
RestartSec=10
Restart=on-failure
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF`}
                />

                <h4>Reload and start node service</h4>
                <CodeBlock
                    codeText={`systemctl daemon-reload
sudo systemctl enable node-exporterd.service
sudo systemctl restart node-exporterd.service
sudo systemctl status node-exporterd.service
sudo journalctl -u node-exporterd.service -fn 50 -o cat`}
                />

                <h4>Setup Prometheus config</h4>

                <CodeBlock
                    codeText={`nano $HOME/prometheus/prometheus.yml`}
                />

                <CodeBlock
                    codeText={`
  - job_name: 'story-node'
    static_configs:
      - targets: ['localhost:26660']`}
                    comment={"Add text below and save"}
                />

                <h4>
                    Restart prometheus services
                </h4>
                <CodeBlock
                    codeText={`sudo systemctl restart  prometheusd.service
sudo systemctl status prometheusd.service`}
                />


                <h4 id="grafana">Install Grafana</h4>
                <CodeBlock
                    codeText={`sudo apt install -y apt-transport-https software-properties-common wget
            sudo mkdir -p /etc/apt/keyrings/
            wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
            echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
            sudo apt update
            sudo apt install grafana
`}
                />

                <h4>
                    Reload and start node service
                </h4>

                <CodeBlock
                    codeText={`sudo systemctl daemon-reload
sudo systemctl enable grafana-servers
sudo systemctl start grafana-server
sudo systemctl status grafana-server`}
                />

                <h4>Setting up dashboard</h4>
                <CodeBlock
                    codeText={`nano $HOME/.story/story/config/config.toml`}
                />

                <CodeBlock
                    codeText={"prometheus = true"}
                    comment={"Set up prometheus to true"}
                />

                <h2>
                    Connect to Grafana
                </h2>

                <p className={"small"}>Open browser and go to http://YOUR_IP:3000</p>

                <p className={"small"}>Login: admin, Password: admin</p>
                <img src={Img1} className={"simple_img"} alt="img"/>


                <h4>On Home page click Connections - Data Sources - Add data source and click on Prometheus
                </h4>

                <img src={Img3} className={"simple_img"} alt="img"/>

                <h4>In connection type: http://localhost:9090, setup name and click Save & test in the end of the
                    page </h4>
                <img src={Img4} className={"simple_img"} alt="img"/>
                <img src={Img5} className={"simple_img"} alt="img"/>

                <h4>Go to Dashboards - New - Import</h4>
                <img src={Img6} className={"simple_img"} alt="img"/>

                <h4>
                    Copy and paste content from our JSON <a href="http://185.197.251.70/story/model.json">File</a>
                </h4>

                <CodeBlock
                    codeText={"http://185.197.251.70/story/model.json"}
                    comment={"Link for the json grafana model"}
                />

                <h3>Congrats, your validator dashboard is ready!</h3>


                <h2>
                    Useful commands
                </h2>

                <h4>Check logs</h4>
                <CodeBlock
                    codeText={"sudo journalctl -u story-geth -f -o cat"}
                />
                <CodeBlock
                    codeText={"sudo journalctl -u story -f -o cat"}
                />

                <h4>Stop node</h4>
                <CodeBlock
                    codeText={"sudo systemctl stop story\n" +
                        "sudo systemctl stop story-geth"}
                />

                <h4>
                    Restart node
                </h4>
                <CodeBlock
                    codeText={"sudo systemctl start story\n" +
                        "sudo systemctl start story-geth"}
                />

                <h4>
                    Check node's status
                </h4>
                <CodeBlock
                    codeText={"curl localhost:26657/status | jq"}
                />

                <h4>
                    Uninstall node
                </h4>
                <CodeBlock
                    codeText={"sudo systemctl stop story-geth\n" +
                        "sudo systemctl stop story\n" +
                        "sudo systemctl disable story-geth\n" +
                        "sudo systemctl disable story\n" +
                        "sudo rm /etc/systemd/system/story-geth.service\n" +
                        "sudo rm /etc/systemd/system/story.service\n" +
                        "sudo systemctl daemon-reload\n" +
                        "sudo rm -rf $HOME/.story\n" +
                        "sudo rm $HOME/go/bin/story-geth\n" +
                        "sudo rm $HOME/go/bin/story"}
                />


            </div>
        </div>
    )
}