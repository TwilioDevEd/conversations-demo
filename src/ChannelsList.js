import React from 'react';
import { List, Typography } from "antd";

import chatChannelsListStyles from "./assets/ChatChannelsList.module.css";
import chatChannelsItemStyles from "./assets/ChatChannelsItem.module.css";

import { joinClassNames } from "./utils/class-name";

const { Text } = Typography;

export class ChannelsList extends React.Component {
    render() {
        const { channels, selectedChannelSid, onChannelClick } = this.props;

        return (
            <List
                header={"Open Conversations"}
                className={chatChannelsListStyles['chat-channels-list']}
                bordered={true}
                loading={channels.length === 0}
                dataSource={channels}
                renderItem={item => {
                    const activeChannel = item.sid === selectedChannelSid;
                    const channelItemClassName = joinClassNames([
                        chatChannelsItemStyles['channel-item'],
                        activeChannel && chatChannelsItemStyles['channel-item--active']
                    ]);

                    return (
                        <List.Item
                            key={item.sid}
                            onClick={() => onChannelClick(item)}
                            className={channelItemClassName}
                        >
                            <Text
                                strong
                                className={chatChannelsItemStyles['channel-item-text']}
                            >
                                {item.friendlyName || item.sid}
                            </Text>
                        </List.Item>
                    )
                }}
            />
        )
    }
}
