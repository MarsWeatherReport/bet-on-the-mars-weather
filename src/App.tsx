import React from 'react'

class App extends React.Component<{ message: string }, { count: number }> {
    state = { count: 100     };
    render() {
      return (
        <div onClick={() => this.increment(1)}>
          {this.props.message} {this.state.count}
        </div>
      );
    }
    increment = (amt: number) => {
      // like this
      this.setState((state) => ({
        count: state.count + amt,
      }));
    };
  }
  export default App