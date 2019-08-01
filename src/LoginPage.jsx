import React from 'react';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        }
    }

    onNameChanged = event => {
        this.setState({ name: event.target.value });
    };

    onFormSubmit = event => {
        event.preventDefault();

        this.props.onSubmit(this.state.name);
    };

    render() {
        return  (
            <form onSubmit={this.onFormSubmit}>
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.onNameChanged}
                    value={this.state.name}
                />
                <button type="submit">Log in</button>
            </form>
        )
    }
}
