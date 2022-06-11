import { Button, Card, Col, Container, Row, Spacer, Table, Text, Tooltip } from '@nextui-org/react';
import React, { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaUserEdit, FaPlay, FaStop } from 'react-icons/fa';
import { useCourtStatuses, useFixture } from '../../api/hook';
import { IconButton } from '../../components/IconButton';
import MultiSelectModal from '../../components/MultiSelectModal';
import SelectModal from '../../components/SelectModal';
import { fixture, player } from '../../types';
import { Court, getStatus, Match } from '../../types/fixture';
import { totalTime } from '../../utils/time';

const Home: React.FC = () => {
  const { data, service, mutate } = useFixture();
  const { data: courtStatus, mutate: mutateCourtStatus } = useCourtStatuses();
  const [visible, setVisible] = useState(false);
  const [selectPlayerVisible, setSelectPlayerVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>();

  const onClick = useCallback(async () => {
    const name = prompt('Name?');
    if (name) {
      await service.addPlayer(name);
      mutate();
    }
  }, [mutate, service]);

  const onCreateMatchClick = useCallback(async () => {
    setVisible(true);
  }, []);

  const onCloseHandler = useCallback(
    async (e?: Court) => {
      setVisible(false);
      if (e) {
        await service.createMatch(e.id);
        mutate();
      }
    },
    [mutate, service],
  );

  const onEditPlayer = useCallback((m: Match) => {
    setSelectPlayerVisible(true);
    setSelectedMatch(m);
  }, []);

  const onSelectPlayerCloseHandler = useCallback(
    async (e?: player.Player[]) => {
      setSelectPlayerVisible(false);
      if (e && selectedMatch) {
        await service.assignPlayersToMatch(selectedMatch.id, e);
        mutate();
      }
      setSelectedMatch(null);
    },
    [mutate, selectedMatch, service],
  );

  const onCreateCourtClick = useCallback(async () => {
    const name = prompt('Name?') || '';
    await service.createCourt(name);
    mutate();
  }, [mutate, service]);

  const onStartMatch = useCallback(
    async (id: string) => {
      await service.startMatch(id);
      mutate();
      mutateCourtStatus();
    },
    [mutate, mutateCourtStatus, service],
  );

  const onEndMatch = useCallback(
    async (id: string) => {
      await service.endtMatch(id);
      mutate();
      mutateCourtStatus();
    },
    [mutate, mutateCourtStatus, service],
  );

  const players = useMemo(() => {
    return data?.players || [];
  }, [data?.players]);

  const matches = useMemo(() => {
    return data?.matches || [];
  }, [data?.matches]);

  return (
    <Container gap={0}>
      <Text h1>Fixture</Text>
      <Row>
        <Col span={3}>
          <Row gap={1}>
            <Text h3>Players</Text>
            <Button shadow auto color='primary' icon={<FaPlus />} onClick={onClick} />
          </Row>
          <Spacer />
          <Table
            aria-label='Example table with static content'
            css={{
              height: 'auto',
              minWidth: '100%',
            }}
          >
            <Table.Header>
              <Table.Column>Name</Table.Column>
              <Table.Column>Plays</Table.Column>
            </Table.Header>
            <Table.Body items={players}>
              {(item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{data?.playerMatchCount[item.id]}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Col>
        <Col span={9}>
          <Row gap={1}>
            <Text h3>Courts</Text>
            <Button shadow auto color='primary' icon={<FaPlus />} onClick={onCreateCourtClick} />
          </Row>
          <Spacer />
          <Row gap={1}>
            {data?.courts.map((c) => (
              <Col span={4} key={c.id}>
                <Card>
                  <Card.Body>
                    <Text>
                      Name: {c.name}
                      <br />
                      No. of players: {c.numberOfPlayers}
                      <br />
                      Current Match: {courtStatus && courtStatus[c.id]?.match?.id}
                      <br />
                      Status: {courtStatus && getStatus(courtStatus[c.id]?.match)}
                    </Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Spacer y={1} />
      <Row>
        <Col>
          <Row gap={1}>
            <Text h3>Matches</Text>
            <Button shadow auto color='primary' icon={<FaPlus />} onClick={onCreateMatchClick} />
          </Row>
          <SelectModal
            title='Select Court'
            data={data?.courts || []}
            visible={visible}
            closeHandler={onCloseHandler}
            textSelector={(e) => e.name}
          />
          <MultiSelectModal
            title='Select Players'
            data={data?.players || []}
            visible={selectPlayerVisible}
            closeHandler={onSelectPlayerCloseHandler}
            textSelector={(e) => e.name}
            keySelector={(e) => e.id}
          />
          <Table
            aria-label='Example table with static content'
            css={{
              height: 'auto',
              minWidth: '100%',
            }}
          >
            <Table.Header>
              <Table.Column>Court</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Players</Table.Column>
              <Table.Column>Start time</Table.Column>
              <Table.Column>End time</Table.Column>
              <Table.Column>Total time</Table.Column>
              <Table.Column width={150}> </Table.Column>
            </Table.Header>
            <Table.Body items={matches}>
              {(item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.court?.name}</Table.Cell>
                  <Table.Cell>{fixture.getStatus(item)}</Table.Cell>
                  <Table.Cell>
                    <Text>{item.players?.map(p => p.player.name).join(',')}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {item.startTime && new Date(item.startTime).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{item.endTime && new Date(item.endTime).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    {item.startTime && item.endTime && totalTime(item.startTime, item.endTime)}
                  </Table.Cell>
                  <Table.Cell>
                    <Row justify='space-between' align='center'>
                      <Col span={3} css={{ d: 'flex' }}>
                        <Tooltip content='Edit Players'>
                          <IconButton onClick={() => onEditPlayer(item)}>
                            <FaUserEdit size={20} fill='#979797' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col span={3} css={{ d: 'flex' }}>
                        <Tooltip content='Start'>
                          <IconButton onClick={() => onStartMatch(item.id)}>
                            <FaPlay size={20} fill='#0072F5' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col span={3} css={{ d: 'flex' }}>
                        <Tooltip content='End' color='error'>
                          <IconButton onClick={() => onEndMatch(item.id)}>
                            <FaStop size={20} fill='#F31260' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {/* {data?.matches.map((m) => (
            <Container key={m.id}>
              <Container>
                Match ID:{' '}
                <Text
                  style={{ fontWeight: 'bold', cursor: 'copy' }}
                  onClick={() => copyToClipBoard(m.id)}
                >
                  {m.id}
                </Text>
                <Container>Status: {fixture.getStatus(m)}</Container>
                <Container>
                  Court: <Text onClick={() => copyToClipBoard(m.court.id)}>{m.court.id}</Text>
                </Container>
                <Container>
                  <span>Players:</span>
                  {m.players?.map((p) => (
                    <Text key={p.player.id}>
                      {p.player.name}({p.side}),
                    </Text>
                  ))}
                </Container>
                <Container>
                  Start Time: {m.startTime && new Date(m.startTime).toLocaleString()}
                </Container>
                <Container>End Time: {m.endTime && new Date(m.endTime).toLocaleString()}</Container>
                <Container>
                  Total Time: {m.startTime && m.endTime && totalTime(m.startTime, m.endTime)}
                </Container>
                <Button onClick={() => onStartMatch(m.id)}>Start</Button>
                <Button onClick={() => onEndMatch(m.id)}>End</Button>
              </Container>
            </Container>
          ))} */}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
