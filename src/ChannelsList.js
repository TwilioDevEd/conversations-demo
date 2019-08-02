import React from 'react';
import { List, Typography } from "antd";
import { joinClassNames } from "./utils/class-name";
import chatChannelsItemStyles from "./ChatChannelsItem.module.scss";

const { Text } = Typography;

export class ChannelsList extends React.Component {
    render() {
        const { channels, selectedChannelSid, onChannelClick } = this.props;

        return (
            <List
                bordered={true}
                style={{ height: "100%", overflowY: 'scroll', overflowX: 'hidden' }}
                loading={channels.length === 0}
                header={"Open Conversations"}
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
                                {item.friendlyName}
                            </Text>
                        </List.Item>
                    )
                }}
            />
        )
    }
}
