import React, { useState } from 'react';
import { FiClipboard, FiCheck } from 'react-icons/fi';

const CodeBlock = ({ codeText , comment}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-block">
            <div className="code-block-header">
                <span className="circle red"></span>
                <span className="circle yellow"></span>
                <span className="circle green"></span>
            </div>
            <pre className="code-block-content">
        <code>{codeText} </code>

                {
                    comment ?
                    <code className={"comment"}>{"\n \n" + comment}</code> : null
                }
      </pre>
            <button className="copy-button" onClick={handleCopy}>
                {copied ? <FiCheck className="icon" /> : <FiClipboard className="icon" />}
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

export default CodeBlock;
