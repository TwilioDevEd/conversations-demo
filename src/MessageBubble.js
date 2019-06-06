import React, { Component } from 'react';
import styles from './MessageBubble.module.css';

class MessageBubble extends Component {
    render = () => {
        const {itemStyle, divStyle} = this.props.direction === "incoming"
                    ? {itemStyle: styles.received_msg,    divStyle: styles.received_withd_msg}
                    : {itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg          }; 
        
        const m = this.props.message;

        return <li className={itemStyle}>
            <div className={divStyle}>
                <p>
                    <strong>{m.author}</strong><br />
                    {m.body}
                </p>
                <span className={styles.time_date}>{m.timestamp.toLocaleString()}</span>
            </div>
        </li>;
    }
}

export default MessageBubble;
