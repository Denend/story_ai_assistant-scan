import React, { useState } from 'react';
import { FiClipboard, FiCheck } from 'react-icons/fi';

const CodeTabBlock = ({ tabs }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const handleCopy = () => {
        navigator.clipboard.writeText(tabs[activeTab].codeText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-block">
            <div className="tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="code-block-header">
                <span className="circle red"></span>
                <span className="circle yellow"></span>
                <span className="circle green"></span>
            </div>
            <pre className="code-block-content">
                <code>{tabs[activeTab].codeText + "\n"}</code>
                {tabs[activeTab].comment && (
                    <code className="comment">{"\n" + tabs[activeTab].comment}</code>
                )}
            </pre>
            <button className="copy-button" onClick={handleCopy}>
                {copied ? <FiCheck className="icon" /> : <FiClipboard className="icon" />}
                {copied ? 'Copied!' : 'Copy'}
            </button>

            {tabs[activeTab].comments && (
                <div className="comments-section">
                    <h4>Comments:</h4>
                    <ul>
                        {tabs[activeTab].comments.map((comment, index) => (
                            <li key={index}>{comment}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CodeTabBlock;
