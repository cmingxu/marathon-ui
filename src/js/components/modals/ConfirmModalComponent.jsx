var Mousetrap = require("mousetrap");
var React = require("react/addons");
var Util = require("../../helpers/Util");

var ModalComponent = require("../ModalComponent");

var ConfirmModalComponent = React.createClass({
  displayName: "ConfirmModalComponent",

  propTypes: {
    message: React.PropTypes.string,
    onConfirm: React.PropTypes.func,
    onDestroy: React.PropTypes.func
  },

  componentDidMount: function () {
    let refs = this.refs;

    React.findDOMNode(refs.confirmButton).focus();
    /*eslint-disable new-cap */
    Mousetrap(React.findDOMNode(refs.modalComponent))
      .bind("esc", this.handleDestroy);
    /*eslint-enable new-cap */
  },

  componentWillUnmount: function () {
    /*eslint-disable new-cap */
    Mousetrap(React.findDOMNode(this.refs.modalComponent)).unbind("esc");
    /*eslint-enable new-cap */
  },

  getDefaultProps: function () {
    return {
      message: "",
      onConfirm: Util.noop,
      onDestroy: Util.noop
    };
  },

  handleDestroy: function () {
    this.refs.modalComponent.destroy();
  },

  handleConfirm: function () {
    this.props.onConfirm();
  },

  render: function () {
    return (
      <ModalComponent
          centered={true}
          dismissOnClickOutside={true}
          ref="modalComponent"
          size="sm"
          onDestroy={this.props.onDestroy}>
        <div className="modal-body reduced-padding">
          {this.props.message}
          <div className="modal-controls fixed-height">
            <button
                className="btn btn-sm  btn-success pull-right"
                ref="confirmButton"
                tabIndex="2"
                type="button"
                onClick={this.handleConfirm}>
              OK
            </button>
            <button
                className="btn btn-sm btn-default pull-right"
                ref="dismissButton"
                tabIndex="1"
                type="button"
                onClick={this.handleDestroy}>
              Cancel
            </button>
          </div>
        </div>
      </ModalComponent>
    );
  }
});

module.exports = ConfirmModalComponent;
