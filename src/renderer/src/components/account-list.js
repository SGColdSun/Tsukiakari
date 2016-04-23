import React, { Component, PropTypes } from 'react';
import { isEmpty } from 'lodash';

export default class AccountList extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    accounts: PropTypes.array,
  };

  static defaultProps = {
    onSelect: () => null,
    accounts: [],
  }

  constructor(props) {
    super(props);
    this.state = { selectedAccount: props.accounts[0] || {} };
    this.onSelect = ::this.onSelect;
  }

  onSelect(account) {
    this.props.onSelect(account);
  }

  renderAccounts() {
    if (isEmpty(this.props.accounts)) return null;
    return this.props.accounts.map(account => {
      const onClick = this.onSelect.bind(this, account);
      return (
        <div key={account.id} onClick={onClick}>
          <img
            src={account.profile_image_url}
            className="account-selector__avatar"
            style={account.id === this.state.selectedAccount.id ? { border: 'solid 1px red' } : {}}
          />
          {/* <span className="accounts__name">{account.screen_name}</span> */ }
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderAccounts()}
      </div>
    );
  }
}