import React, { Component, PureComponent } from "react";
import styles from "./assets/MessageBubble.module.css";
import PropTypes from "prop-types";
import { Spin, Modal, Icon } from "antd";
import WhatsappIcon from "./WhatsappIcon";
import ChatIcon from "./ChatIcon";

class MessageBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMedia: this.props.message.type === "media",
      mediaDownloadFailed: false,
      mediaUrl: null
    };
  }

  componentDidMount = async () => {
    this.setState({
      ...this.state,
      type: (await this.props.message.getParticipant()).type
    });
    if (this.state.hasMedia) {
      this.props.message.media
        .getContentTemporaryUrl()
        .then((url) => {
          this.setState({ mediaUrl: url });
        })
        .catch((e) => this.setState({ mediaDownloadFailed: true }));
    }
    document
      .getElementById(this.props.message.sid)
      .scrollIntoView({ behavior: "smooth" });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    document
      .getElementById(this.props.message.sid)
      .scrollIntoView({ behavior: "smooth" });
  }

  render = () => {
    const { itemStyle, divStyle } =
      this.props.direction === "incoming"
        ? {
            itemStyle: styles.received_msg,
            divStyle: styles.received_withd_msg
          }
        : { itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg };

    const m = this.props.message;
    const type = this.state.type;

    if (this.state.hasMedia) {
      console.log("Message is media message");
      // log media properties
      console.log("Media properties", m.media);
    }
    console.log(m);
    return (
      <li id={m.sid} className={itemStyle}>
        <div className={divStyle}>
          <div>
            <strong>
              {type === "whatsapp" && (
                <Icon style={{ fontSize: "16px" }} component={WhatsappIcon} />
              )}
              {type === "chat" && (
                <Icon style={{ fontSize: "16px" }} component={ChatIcon} />
              )}
              {type === "sms" && <Icon type={"mobile"} />}
              {` ${m.author}`}
            </strong>

            <br />
            <div className={styles.medias}>
              {this.state.hasMedia && (
                <Media
                  hasFailed={this.state.mediaDownloadFailed}
                  url={this.state.mediaUrl}
                />
              )}
            </div>
            {m.body}
          </div>
          <span className={styles.time_date}>
            {m.state.timestamp.toLocaleString()}
          </span>
        </div>
      </li>
    );
  };
}

class Media extends PureComponent {
  render = () => {
    const { hasFailed, url } = this.props;
    return (
      <div
        className={`${styles.media}${!url ? " " + styles.placeholder : ""}`}
        onClick={() => {
          Modal.info({
            centered: true,
            icon: null,
            okText: "Close",
            width: "60%",
            content: (
              <div className={styles.picture_container}>
                <img style={{ width: "100%", height: "100%" }} src={url} />
              </div>
            )
          });
        }}
      >
        {!url && !hasFailed && <Spin />}

        {hasFailed && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Icon type={"warning"} style={{ fontSize: "5em" }} />
            <p>Failed to load media</p>
          </div>
        )}

        {!hasFailed && url && (
          <div className={styles.media_icon}>
            <div style={{ zIndex: 123, position: "absolute" }}>
              <Icon type={"eye"} style={{ fontSize: "5em", opacity: 0.3 }} />
            </div>
            <div
              className={styles.picture_preview}
              style={{ backgroundImage: `url(${url})`, zIndex: 122 }}
            ></div>
          </div>
        )}
      </div>
    );
  };
}

Media.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  url: PropTypes.string
};

export default MessageBubble;
