import MessageBubble from "./MessageBubble";
import React, {PureComponent} from "react";
import PropTypes from "prop-types";

class ChatMessages extends PureComponent {
  render = () => {
    return (
        <ul id="messages">
          { this.props.messages.map(m => {
            if (m.author === this.props.identity)
              return <MessageBubble key={m.index} direction="outgoing" message={m} />;
            else
              return <MessageBubble key={m.index} direction="incoming" message={m} />;
          })
          }
        </ul>
    );
  }
}

ChatMessages.propTypes = {
  identity: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChatMessages;