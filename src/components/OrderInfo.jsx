import React, { PureComponent } from "react";

export default class OrderInfo extends PureComponent {
  render() {
    const { info } = this.props;
    const displayName = `${info.name}, ${info.destination}`;

    return (
      <div>
        <div>
          <p>{info.id}</p>
          <p>{info.name}</p>
          <p>{info.destination}</p>
          <p>{info.event_name}</p>
          {/* {displayName} |{" "}
          <a
            target="_new"
            href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}
          >
            Wikipedia
          </a> */}
        </div>
        {/* <img width={240} src={info.image} /> */}
      </div>
    );
  }
}
