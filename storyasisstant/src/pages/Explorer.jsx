import { useParams } from 'react-router-dom';
import { Logo } from "../particles/Logo";
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';

const transformData = (initialData) => {
  if (initialData) {
    const {
      commission,
      unbonding_time,
      update_time,
      tokens,
      delegator_shares,
      participation,
      signingInfo,
      uptime,
      status,
      votingPowerPercent,
      cumulativeShare,
      ...other
    } = initialData;

    const dateFields = ['unbonding_time', 'update_time'];
    dateFields.forEach((field) => {
      if (initialData[field]) {
        const date = new Date(initialData[field]);
        if (!isNaN(date)) other[field] = date.toLocaleString();
      }
    });

    const successBlockRate = (uptime?.historicalUptime?.successBlocks / uptime?.historicalUptime?.lastSyncHeight * 100).toFixed(2) || 'N/A';
    const totalTokensFormatted = Number(tokens).toLocaleString();
    const delegatorSharesFormatted = Number(delegator_shares).toLocaleString();
    
    const historicalProgress = uptime?.historicalUptime
      ? uptime.historicalUptime.lastSyncHeight - uptime.historicalUptime.earliestHeight
      : "N/A";

    const averageUptimePercentage = uptime?.historicalUptime
      ? ((uptime.historicalUptime.successBlocks / historicalProgress) * 100).toFixed(2) + '%'
      : 'N/A';

    const statusDescription = (status) => {
      switch (status) {
        case 1:
          return "Unbonded";
        case 2:
          return "Unbonding";
        case 3:
          return "Bonded";
        default:
          return "Unknown";
      }
    };

    return {
      ...other,
      commissionRate: commission?.commission_rates?.rate || 'N/A',
      maxCommissionRate: commission?.commission_rates?.max_rate || 'N/A',
      totalTokens: totalTokensFormatted,
      delegatorShares: delegatorSharesFormatted,
      participationRate: participation?.rate || 'N/A',
      uptimePercentage: uptime?.windowUptime?.uptime
          ? (uptime.windowUptime.uptime * 100).toFixed(2) + '%'
          : 'N/A',
      successBlockRate,
      historicalProgress,
      averageUptimePercentage,
      jailedStatus: signingInfo?.tombstoned ? "Jailed" : "Not Jailed",
      statusDescription: statusDescription(status),
      votingPowerPercent: (votingPowerPercent * 100).toFixed(2) + '%',
      cumulativeShare: cumulativeShare ? (cumulativeShare * 100).toFixed(2) + '%' : "N/A "
    };
  }
  return {};
};


const dataKeys = {
  operator_address: 'Operator Address 🆔',
  totalTokens: 'Total Tokens 💰',
  delegatorShares: 'Delegator Shares 📊',
  unbonding_time: 'Unbonding Time ⌚',
  commissionRate: 'Commission Rate 🪙',
  maxCommissionRate: 'Max Commission Rate 📈',
  participationRate: 'Participation Rate ⚖️',
  uptimePercentage: 'Window Uptime % 📈',
  successBlockRate: 'Success Block Rate 🔥',
  historicalProgress: 'Historical Progress 🏗️',
  averageUptimePercentage: 'Average Uptime % 📊',
  jailedStatus: 'Jailed Status 🚨',
  statusDescription: 'Validator Status ⚖️',
  votingPowerPercent: 'Voting Power % 🗳️',
  cumulativeShare: 'Cumulative Share % 📊',
};


const substituteName = (key) => dataKeys[key] || key;

export const ExplorerPage = () => {
  const params = useParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Unknown');
  const [nodeId, setNodeId] = useState('');
  const navigate = useNavigate();

  const [syncPercents, setSyncPersents] = useState(0);

  const fetchData = (id) => {
    return fetch('https://corsproxy.io/?key=f34e9546&url=' + encodeURIComponent(`https://api.testnet.storyscan.app/validators/${id}`))
        .then(res => res.json())
        .then(r => {
          console.log(r);
          return r;
        });
  };

  const { mutate, isError } = useMutation(fetchData, {
    onSuccess: (newData) => {
      setData(newData);
      if (initialLoading) setInitialLoading(false);

      if (newData.uptime && newData.uptime.windowUptime && newData.uptime.windowUptime.uptime) {
        const syncPercentage = (newData.uptime.windowUptime.uptime * 100).toFixed(2);
        setSyncStatus(`${syncPercentage}%`);
        setSyncPersents(syncPercentage);
      } else {
        setSyncStatus(0);
        setSyncPersents(0);
      }
    },
    onError: () => {
      if (initialLoading) setInitialLoading(false);
    },
  });

  useEffect(() => {
    if (params && params.id) {
      console.log('Fetching data for ID:', params.id);
      mutate(params.id);
    }
  }, [params.id]);

  const handleSearch = () => {
    if (nodeId.length !== 0) navigate(`/explore/${nodeId}`);
  };

  return (
      <div className="container explorer">
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
        <div className="search">
          <div className="search__input">
            <div>
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.23336 1.8999C4.74306 1.8999 1.90002 4.74293 1.90002 8.23324C1.90002 11.7235 4.74306 14.5666 8.23336 14.5666C9.75115 14.5666 11.145 14.0276 12.2375 13.1329L16.0189 16.9144C16.0773 16.9751 16.1472 17.0237 16.2245 17.0571C16.3019 17.0905 16.3851 17.1082 16.4694 17.109C16.5536 17.1099 16.6372 17.0939 16.7152 17.0621C16.7932 17.0302 16.8641 16.9831 16.9237 16.9236C16.9833 16.864 17.0304 16.7931 17.0622 16.7151C17.0941 16.6371 17.11 16.5535 17.1092 16.4692C17.1083 16.385 17.0907 16.3017 17.0572 16.2244C17.0238 16.147 16.9753 16.0771 16.9145 16.0188L13.133 12.2373C14.0277 11.1449 14.5667 9.75102 14.5667 8.23324C14.5667 4.74293 11.7237 1.8999 8.23336 1.8999ZM8.23336 3.16657C11.0391 3.16657 13.3 5.42749 13.3 8.23324C13.3 11.039 11.0391 13.2999 8.23336 13.2999C5.42761 13.2999 3.16669 11.039 3.16669 8.23324C3.16669 5.42749 5.42761 3.16657 8.23336 3.16657Z"
                    fill="black"
                />
              </svg>
            </div>
            <input
                defaultValue={params.id}
                onChange={e => {
                  setNodeId(e.target.value);
                }}
                type="text" name="search" placeholder='Enter your Compressed Pubkey (base64)'
            />
          </div>
          <button onClick={handleSearch}>Search</button>
        </div>

        {isError ? (
            <h3 className='error'>Error, try entering the key again</h3>
        ) : data ? (
            <>
              <div className="progress-container">
                <p>Window uptime: {syncStatus ? syncStatus : "Not synchronized"}</p>
                <div className="progress-bar">
                  <div
                      className="progress-bar-fill"
                      style={{ width: `${syncPercents}%` }}
                  ></div>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                  </thead>
                  <tbody>
                  {Object.entries(transformData(data))
                      .filter(([key]) => dataKeys[key])
                      .map(([key, value]) => (
                          <tr key={key}>
                            <td>{substituteName(key)}</td>
                            <td>
                              {typeof value === 'object' && value !== null
                                  ? JSON.stringify(value)
                                  : value}
                            </td>
                          </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
        ) : null}
      </div>
  );
};
