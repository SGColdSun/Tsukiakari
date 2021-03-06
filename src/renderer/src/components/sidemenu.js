import React, { PureComponent } from 'react';
import B from '../lib/bem';

const b = B.with('sidemenu');

export default class Sidemenu extends PureComponent {
  static defaultProps = {
    columns: [],
  }

  constructor(props: Props) {
    super(props);
    this.onAddColumnClick = this.onAddColumnClick.bind(this);
    this.onTweetButtonClick = this.onTweetButtonClick.bind(this);
  }

  onAddColumnClick() {
    if (this.props.isAddColumnMenuOpen) {
      this.props.closeAddColumnMenu();
    } else {
      this.props.openAddColumnMenu();
    }
  }

  onTweetButtonClick() {
    if (this.props.isTweetWindowOpen) {
      this.props.closeTweetWindow();
    } else {
      this.props.openTweetWindow();
    }
  }

  renderAddColumnButton() {
    const isOpen = this.props.isAddColumnMenuOpen;
    const text = isOpen ? 'Close menu' : 'Add new column';
    const icon = isOpen ? 'x' : '+';
    return (
      <div className={b('button', { addcolumn: true })} onClick={this.onAddColumnClick}>
        <span>{icon}</span>
        <a className={b('text', { add: true })}>{text}</a>
      </div>
    );
  }

  renderColumList() {
    return this.props.columns.map(column => (
      <li className={b('list')} key={column.id}>
        <i className={`${b('icon')} ${column.icon}`} />
        <span className={b('text', { list: true })}>
          {column.title}
          <span className={b('text', { name: true })}>
            {column.subTitle}
          </span>
        </span>
      </li>
    ));
  }

  renderTweetButtonText() {
    if (this.props.isTweetWindowOpen) {
      return (
        <div>
          <i className={`${b('icon')} lnr lnr-cross`} />
          <span className={b('text', { newtweet: true })}>Close window</span>
        </div>
      );
    }
    return (
      <div>
        <i className={`${b('icon')} icon-tweet`} />
        <span className={b('text', { newtweet: true })}>New tweet</span>
      </div>
    );
  }
  render() {
    return (
      <div className={b()}>
        <div className={b('wrapper')}>
          <div className={b('logo-wrapper')}>
            <img className={b('logo')} src="images/logo.png" alt="tsukiakari" />
            <i className={`${b('menu-icon')} fa fa-bars`} onClick={this.props.onMenuClick} />
          </div>
          <ul className={b('ul')}>
            {this.renderColumList()}
          </ul>
          {this.renderAddColumnButton()}
        </div>
        <div
          className={b('button', { newtweet: true })}
          onClick={this.onTweetButtonClick}
        >
          {this.renderTweetButtonText()}
        </div>
      </div>
    );
  }
}

