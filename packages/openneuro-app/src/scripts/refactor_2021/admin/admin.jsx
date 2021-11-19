// dependencies -------------------------------------------------------

import React from 'react'
import { Redirect, Switch, Route, NavLink } from 'react-router-dom'
import Users from './users.jsx'
import FlaggedFiles from './flagged-files.jsx'
import AdminUser from '../authentication/admin-user.jsx'

class Dashboard extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    return (
      <AdminUser>
        <div className="admin route-wrapper">
          <div className="inner-route clearfix">
            <div className="col-xs-12">
              <ul className="nav nav-pills tabs">
                <li>
                  <NavLink to="/admin/users" className="btn-tab">
                    Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/flagged-files" className="btn-tab">
                    Flagged Files
                  </NavLink>
                </li>
              </ul>
              <Switch>
                <Redirect path="/admin" to="/admin/users" exact />
                <Route
                  name="users"
                  path="/admin/users"
                  exact
                  component={Users}
                />
                <Route
                  name="flaggedFiles"
                  path="/admin/flagged-files"
                  exact
                  component={FlaggedFiles}
                />
              </Switch>
            </div>
          </div>
        </div>
      </AdminUser>
    )
  }
}

export default Dashboard
