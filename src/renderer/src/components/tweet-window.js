import React, { Component } from 'react';
import B from '../lib/bem';
import ResizableAndMovable from 'react-resizable-and-movable';
import Tooltip from 'rc-tooltip';
import AccountList from './account-list';
import { Button } from 're-bulma';
import { isEqual } from 'lodash';
import 'twitter-text';
import Spinner from './spinner';
import log from '../lib/log';
import UploadMedia from '../containers/upload-media';

const b = B.with('tweet-window');

export default class TweetWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 380,
      height: 180,
      status: '',
      destroyTooltip: false,
      selectedAccount: props.accounts[0],
      path: null,
    };
    this.onResize = ::this.onResize;
    this.close = ::this.close;
    this.onDrag = ::this.onDrag;
    this.onClick = ::this.onClick;
    this.onChange = ::this.onChange;
    this.onAccountSelect = ::this.onAccountSelect;
    this.onSelectFile = ::this.onSelectFile;
  }

  componentWillReceiveProps(nextProps) {
    const nextId = nextProps.replyTweet.id_str;
    if (nextId && nextId !== this.props.replyTweet.id_str) {
      this.setState({ status: `@${nextProps.replyTweet.user.screen_name} ` });
    }
    if (nextProps.isOpen !== this.props.isOpen) {
      this.setState({ destroyTooltip: true });
    }
    if (nextProps.media.length !== this.props.media.length) {
      this.setState({ path: null });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  onDrag() {
    this.setState({ destroyTooltip: true });
  }

  onAccountSelect(account) {
    this.setState({ selectedAccount: account, destroyTooltip: true });
  }

  onResize(_, size, client) {
    log.debug(size, client);
    this.setState({ height: size.height, width: size.width, destroyTooltip: true });
  }

  onClick() {
    this.props.post(this.state.selectedAccount, this.state.status, this.props.replyTweet);
    // TODO: move to reducer, if post failed note delete status
    this.setState({ status: '', destroyTooltip: true });
  }

  onChange({ target: { value } }) {
    this.setState({ status: value });
  }

  onSelectFile({ target }) {
    // TODO: accounce
    if (this.props.media.length >= 4) return;
    this.setState({ path: target.value });
    this.props.uploadMedia({ account: this.state.selectedAccount, files: target.files });
  }

  onDropFile({ dataTransfer }) {
    // TODO: accounce
    if (this.props.media.length >= 4) return;
    this.setState({ path: dataTransfer.path });
    this.props.uploadMedia({ account: this.state.selectedAccount, files: dataTransfer.files });
  }

  close() {
    this.props.close();
    this.setState({ destroyTooltip: true });
  }

  renderAvatar() {
    // TODO:
    if (!this.state.selectedAccount) return <span>loading</span>;
    return (
      <img
        src={this.state.selectedAccount.profile_image_url}
        className={b('avatar')}
      />
    );
  }

  renderTooltip() {
    return (
      <div className={b('tooltip')}>
        <AccountList
          accounts={this.props.accounts}
          selectedAccount={this.state.selectedAccount}
          onSelect={this.onAccountSelect}
        />
      </div>
    );
  }

  renderAccount() {
    if (this.props.accounts.length === 0) return <i className="fa fa-spin fa-spinner" />;
    return (
      <Tooltip
        trigger="click"
        overlay={this.props.accounts.length > 1
                 ? this.renderTooltip()
                 : null}
        destroyTooltipOnHide={this.state.destroyTooltip}
        placement="bottom"
        mouseLeaveDelay={0}
        overlayStyle={{
          position: 'absolute',
          top: '5px',
          left: '50px',
          zIndex: '9999',
        }}
      >
        {this.renderAvatar()}
      </Tooltip>
    );
  }

  render() {
    const remain = 140 - twttr.txt.getTweetLength(this.state.status);
    let buttonState = undefined;
    if (remain < 0 || remain === 140) buttonState = 'isDisabled';
    else if (this.props.isPosting) buttonState = 'isLoading';
    return (
      <div
        style={
          this.props.isOpen ? {
            pointerEvents: 'none',
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
          } : {
            display: 'none',
          }
        }
      >
        <ResizableAndMovable
          x={100}
          y={300}
          width={this.state.width}
          height={this.state.height}
          minWidth={300}
          minHeight={150}
          maxWidth={800}
          maxHeight={800}
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            top: '0px',
            left: '0px',
            pointerEvents: 'auto',
            padding: this.props.media.length === 0 ? '0 0 4px 0' : '0 0 64px 0',
          }}
          bounds="parent"
          className={b()}
          onResize={this.onResize}
          onDrag={this.onDrag}
          canUpdateSizeByParent
        >
          <div className={b('title-wrapper')}>
            <span className={b('title')}>
              <i className={`${b('icon')} icon-tweet`} />
              New Tweet
            </span>
            <i
              className={`${b('icon')} lnr lnr-cross`}
              onClick={this.close}
            />
          </div>
          <div
            className={b('body')}
            onDragLeave={() => console.log('leave')}
            onDragOver={() => console.log('asd')}
        onDrop={this.onDropFile.bind(this)}
          >
            {this.renderAccount()}
            <div className={b('textarea-wrapper')}>
              <textarea
                onChange={this.onChange}
                style={{
                  height: this.state.height - 110,
                  borderRadius: this.props.media.length === 0 ? '3px' : '3px 3px 0 0',
                }}
                value={this.state.status}
                placeholder="What's happening?"
                readOnly={false}
                className={b('textarea')}
              />
              <UploadMedia media={this.props.media} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 16px' }}>
                <div style={{ width: '20px', margin: '0 auto 0 0', padding: '14px 0 0px 0', position: 'relative' }}>
                  <i className="fa fa-camera" style={{ fontSize: '16px', color: '#666', position: 'absolute', top: '14px', left: 0 }} />
                  <input
                    style={{
                      width: '20px',
                      height: '34px',
                      cursor: 'pointer',
                      opacity: 0,
                      position: 'absolute',
                      top: '-5px',
                      left: 0,
                      display: 'block',
                      value: this.state.path,
                    }}
                    onChange={this.onSelectFile}
                    type="file"
                    placeholder=""
                  />
                </div>
                <div style={{ width: '20px', padding: '16px 0 0 0', color: remain < 0 ? '#ed6c63' : '#666' }}>
                  {remain}
                </div>
                <Button
                  onClick={this.onClick}
                  color="isPrimary"
                  style={{
                    margin: '6px 16px 0',
                    width: '80px',
                    display: 'block',
                    color: '#fff',
                    background: '#1cc09f',
                  }}
                  state={buttonState}
                >
                  <i className="icon-tweet" /> Tweet
                </Button>
              </div>
            </div>
          </div>
      {
        this.props.isMediaUploading
          ? <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', opacity: '0.7' }}><Spinner style={{ padding: '10% 0 0 80px' }} /></div>
          : null
      }
        </ResizableAndMovable>
      </div>
    );
  }
}
