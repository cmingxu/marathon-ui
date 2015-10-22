var Link = require("react-router").Link;
var React = require("react/addons");

var AppListFilterComponent = require("../components/AppListFilterComponent");
var AppListLabelsFilterComponent =
  require("../components/AppListLabelsFilterComponent");
var AppListStatusFilterComponent =
  require("../components/AppListStatusFilterComponent");
var AppListTypeFilterComponent =
  require("../components/AppListTypeFilterComponent");
var AppListComponent = require("../components/AppListComponent");
var BreadcrumbComponent = require("../components/BreadcrumbComponent");
var DeploymentsListComponent =
  require("../components/DeploymentsListComponent");
var TabPaneComponent = require("../components/TabPaneComponent");
var TogglableTabsComponent = require("../components/TogglableTabsComponent");
var AppListViewTypes = require("../constants/AppListViewTypes");

var tabs = require("../constants/tabs");

var TabPanesComponent = React.createClass({
  displayName: "TabPanesComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      currentGroup: "/",
      filterText: "",
      filterLabels: [],
      filterStatus: [],
      filterTypes: []
    };
  },

  componentWillReceiveProps: function () {
    this.updateCurrentGroup();
  },

  componentWillMount: function () {
    this.updateCurrentGroup();
  },

  updateCurrentGroup: function () {
    var {groupId} = this.context.router.getCurrentParams();
    if (groupId == null) {
      groupId = "/";
    }
    groupId = decodeURIComponent(groupId);
    if (!groupId.endsWith("/")) {
      groupId += "/";
    }

    this.setState({
      currentGroup: groupId
    });
  },

  updateFilterText: function (filterText) {
    this.setState({
      filterText: filterText
    });
  },

  updateFilterLabels: function (filterLabels) {
    this.setState({
      filterLabels: filterLabels
    });
  },

  updateFilterStatus: function (filterStatus) {
    this.setState({
      filterStatus: filterStatus
    });
  },

  updateFilterTypes: function (filterTypes) {
    this.setState({
      filterTypes: filterTypes
    });
  },

  getTabId: function () {
    var path = this.context.router.getCurrentPathname();

    var hasTab = tabs.find(tab => tab.id === path);

    if (hasTab) {
      return path;
    }

    return tabs[0].id;
  },

  getClearLinkForFilter: function (filterQueryParamKey) {
    var state = this.state;

    if (state[filterQueryParamKey].length === 0) {
      return null;
    }

    let router = this.context.router;
    let currentPathname = router.getCurrentPathname();
    let query = Object.assign({}, router.getCurrentQuery());
    let params = router.getCurrentParams();

    if (query[filterQueryParamKey] != null) {
      delete query[filterQueryParamKey];
    }

    return (
      <Link to={currentPathname} query={query} params={params}>
        Clear
      </Link>
    );
  },

  render: function () {
    var path = this.context.router.getCurrentPathname();
    var state = this.state;

    var appListProps = {
      currentGroup: state.currentGroup,
      filterText: state.filterText,
      filterLabels: state.filterLabels,
      filterTypes: state.filterTypes,
      filterStatus: state.filterStatus,
      viewType: AppListViewTypes.LIST
    };

    return (
      <TogglableTabsComponent activeTabId={this.getTabId()}
          className="container-fluid content content-fixed">
        <TabPaneComponent id={tabs[0].id} className="flex-container">
          <div className="wrapper">
            <nav className="sidebar sidebar-scroll">
              <Link to={path}
                query={{modal: "new-app"}}
                className="btn btn-success create-app"
                activeClassName="create-app-active">
                Create
              </Link>
              <div className="flex-row">
                <h3 className="small-caps">Status</h3>
                {this.getClearLinkForFilter("filterStatus")}
              </div>
              <AppListStatusFilterComponent
                onChange={this.updateFilterStatus} />
              <div className="flex-row">
                <h3 className="small-caps">Application Type</h3>
                {this.getClearLinkForFilter("filterTypes")}
              </div>
              <AppListTypeFilterComponent onChange={this.updateFilterTypes} />
              <div className="flex-row">
                <h3 className="small-caps">Label</h3>
                {this.getClearLinkForFilter("filterLabels")}
              </div>
              <AppListLabelsFilterComponent
                onChange={this.updateFilterLabels} />
              <div className="flex-row">
                <h3 className="small-caps">Resources</h3>
              </div>
              <div className="range-input">
                <p className="legend">CPU</p>
                <div className="flex-row">
                  <input type="text"
                    className="form-control"
                    placeholder="0.1" />
                  <span>to</span>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="range-input">
                <p className="legend">Memory</p>
                <div className="flex-row">
                  <input type="text"
                         className="form-control"
                         placeholder="32" />
                  <span>to</span>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </nav>
            <main>
              <div className="contextual-bar">
                <BreadcrumbComponent groupId={state.currentGroup} />
                <div className="app-list-controls">
                  <AppListFilterComponent onChange={this.updateFilterText}/>
                  <div className="btn-group toggle-list-view">
                    <button className="btn btn-default"
                      type="button">
                      <i className="icon ion-navicon" /> List
                    </button>
                    <button className="btn btn-default"
                      type="button">
                      <i className="icon ion-navicon" /> Tree
                    </button>
                  </div>
                </div>
              </div>
              <div className="app-list-scroll">
                <AppListComponent {...appListProps} />
              </div>
            </main>
          </div>
        </TabPaneComponent>
        <TabPaneComponent id={tabs[1].id}>
          <DeploymentsListComponent />
        </TabPaneComponent>
      </TogglableTabsComponent>
    );
  }
});

module.exports = TabPanesComponent;
