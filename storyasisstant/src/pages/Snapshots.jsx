import {Logo} from "../particles/Logo";
import CodeBlock from "../particles/CodeBlock";
import CodeTabBlock from "../particles/CodeTabBlock";
import scriptImg from "../images/script-2.png";

const Snapshots = () => {
    const installingCode = {
        "1": `sudo apt-get install wget lz4 aria2 pv -y`,
        "2": `sudo systemctl stop story
sudo systemctl stop story-geth`,

        "3": `cp ~/.story/story/data/priv_validator_state.json ~/.story/priv_validator_state.json.backup`,

        "4": `rm -rf ~/.story/story/data
rm -rf ~/.story/geth/iliad/geth/chaindata`,

        "5": `sudo mkdir -p /root/.story/story/data
lz4 -d -c Story_snapshot.lz4 | pv | sudo tar xv -C ~/.story/story/data/ > /dev/null`,

        "6": `cp ~/.story/priv_validator_state.json.backup ~/.story/story/data/priv_validator_state.json`,

        "7": `sudo systemctl start story
sudo systemctl start story-geth`,
        "15": `sudo mkdir -p /root/.story/geth/iliad/geth/chaindata
lz4 -d -c Geth_snapshot.lz4 | pv | sudo tar xv -C ~/.story/geth/iliad/geth/chaindata/ > /dev/null`
    };

    const snapshotTabs = [
        {
            label: 'Archive Story Snapshot',
            codeText: `rm -f Story_snapshot.lz4
aria2c -x 16 -s 16 -k 1M http://65.108.14.28/story/snapshots/Story_snapshot.lz4`,
        },
        {
            label: 'Pruned Story Snapshots',
            codeText: `rm -f Story_snapshot.lz4
aria2c -x 16 -s 16 -k 1M http://65.109.159.109/story/snapshots_pruned/Story_snapshot.lz4`,
        }
    ];
    const snapshotTabs2 = [
        {
            label: 'Archive Story-Geth Snapshot',
            codeText: `rm -f Geth_snapshot.lz4
aria2c -x 16 -s 16 -k 1M http://65.108.14.28/story/snapshots/Geth_snapshot.lz4`,
        },
        {
            label: 'Pruned Story-Geth Snapshots',
            codeText: `rm -f Geth_snapshot.lz4
aria2c -x 16 -s 16 -k 1M http://65.109.159.109/story/snapshots_pruned/Geth_snapshot.lz4`,
        }
    ];


    return (
        <div className="container">
            <nav className="nav">
                <Logo/>
                <ul>
                    <li><a href='/install-node'>Install node</a></li>
                    <li><a href='/snapshots'>Download snapshots</a></li>
                    <li><a href='https://x.com/StoryProtocol' target='_blank'>Twitter</a></li>
                    <li><a href="https://docs.story.foundation/" target='_blank'>Docs</a></li>
                    <li><a href="https://discord.gg/storyprotocol" target='_blank'>Discord</a></li>
                </ul>
            </nav>

            <h1 style={{
                marginTop: "120px"
            }}>
                Snapshots manual
            </h1>

            <div className={"manual"}>
                <h2>
                    Downloading snapshot
                </h2>
                <CodeBlock
                    codeText={'FILE=\"story.sh\" && curl -L http://65.109.159.109/story/$FILE -o $FILE && chmod +x $FILE && bash -i $FILE'}
                    comment={"After running the script, choose second option, then type of snapshot you want to use"}/>

                <img src={scriptImg} alt={"image"}/>


                <h2>
                    Downloading snapshot without script
                </h2>

                <h4>Installing dependencies</h4>
                <CodeBlock
                    codeText={installingCode["1"]}
                    comment={"Updating package list and installing necessary dependencies"}
                />

                <h4>Stopping services</h4>
                <CodeBlock
                    codeText={installingCode["2"]}
                />

                <h4>Backing up validator state</h4>
                <CodeBlock
                    codeText={installingCode["3"]}
                />

                <h4>Downloading snapshots</h4>
                <CodeTabBlock
                    tabs={snapshotTabs}
                />

                <CodeTabBlock
                    tabs={snapshotTabs2}
                />

                <h4>Removing old data</h4>
                <CodeBlock
                    codeText={installingCode["4"]}
                />

                <h4>Decompressing snapshots</h4>
                <CodeBlock
                    codeText={installingCode["5"]}
                />

                <CodeBlock
                    codeText={installingCode["15"]}
                />

                <h4>Restoring validator state</h4>
                <CodeBlock
                    codeText={installingCode["6"]}
                />

                <h4>Starting services</h4>
                <CodeBlock
                    codeText={installingCode["7"]}
                />
        </div>


</div>
)
}

export {Snapshots}