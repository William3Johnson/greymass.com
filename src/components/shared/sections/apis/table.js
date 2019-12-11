import React from 'react';

import { injectIntl } from 'gatsby-plugin-intl';

import { Table, Header, Image, Label, Icon } from "semantic-ui-react"

import EosApi from 'eosjs-api';

import eosLogo from '../../../../images/blockchain-eos-logo.svg';
import instarLogo from '../../../../images/blockchain-insights-logo.svg';
import jungleLogo from '../../../../images/blockchain-eos-logo.svg'; // change for real logo
import lynxLogo from '../../../../images/blockchain-lynx-logo.svg'; // change for real logo
import telosLogo from '../../../../images/blockchain-telos-logo.svg';
import waxLogo from '../../../../images/blockchain-wax-logo.svg';

import apisTableStyles from './table.module.css';

const nodes = [
  {
    url: 'https://eos.greymass.com',
    name: 'eos',
    logo: eosLogo,
    v1: true,
  },
  {
    url: 'https://telos.greymass.com',
    name: 'telos',
    logo: telosLogo,
    v1: true,
  },
  {
    url: 'https://jungle.greymass.com',
    name: 'jungle',
    logo: jungleLogo,
    v1: true,
  },
  {
    url: 'https://wax.greymass.com',
    name: 'wax',
    logo: waxLogo,
    v1: true,
  },
  {
    url: 'https://instar.greymass.com',
    name: 'instar',
    logo: instarLogo,
    v1: true,
  },
  {
    url: 'https://lynx.greymass.com',
    name: 'lynx',
    logo: lynxLogo,
    v1: true,
  },
]

class Apis extends React.Component {
  state = { responseTimes: {}, triggeredUpdate: false };

  componentDidMount() {
    const isSSR = typeof window === 'undefined';

    if (isSSR) {
      return;
    }

    setInterval(() => this.tick(), 30000);

    this.tick();
  }

  tick = async () => {
    const newResponseTimes = {};

    await Promise.all(nodes.map(node => {
      return new Promise(resolve => {
        checkResponseTime(node).then(responseTime => {
          newResponseTimes[node.name] = responseTime;

          resolve();
        })
      })
    }))

    this.setState({ responseTimes: newResponseTimes });
  }

  render() {
    const { intl } = this.props;

    const { responseTimes } = this.state;

    return (
      <div className={apisTableStyles.container}>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{intl.formatMessage({ id: 'shared_apis_table_header_name' })}</Table.HeaderCell>
              <Table.HeaderCell>{intl.formatMessage({ id: 'shared_apis_table_header_status' })}</Table.HeaderCell>
              <Table.HeaderCell>{intl.formatMessage({ id: 'shared_apis_table_header_response_time' })}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {nodes.map(node =>  (
              <Table.Row key={node.name}>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src={node.logo} rounded size='mini'/>
                    <Header.Content>
                      {node.name}
                      <Header.Subheader>{node.url}</Header.Subheader>
                      {node.v1 && (<Label size="mini" color="teal" content="v1 history"/>)}
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  {!!responseTimes[node.name] ? (
                    <Icon name="check" size="large" color="green" />
                  ) : (
                    <Icon name="close" size="large" color="red" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {responseTimes[node.name] ?
                    `${responseTimes[node.name]} ms` :
                    '----'
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default injectIntl(Apis);

async function checkResponseTime(node) {
  const eos = EosApi({ httpEndpoint:  node.url });
  const timeBefore = Date.now();

  const fetchedInfo = await new Promise(resolve => {
    eos.getInfo((error) => {
      resolve(!error);
    });
  });

  return fetchedInfo && Date.now() - timeBefore;
}
