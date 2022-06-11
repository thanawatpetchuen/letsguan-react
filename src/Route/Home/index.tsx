import { Button, Card, Col, Container, Row, Spacer, Table, Text, Tooltip } from '@nextui-org/react';
import React, { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaUserEdit, FaPlay, FaStop } from 'react-icons/fa';
import { useCourtStatuses, useFixture } from '../../api/hook';
import CourtModal from '../../components/CourtModal';
import { IconButton } from '../../components/IconButton';
import MultiSelectModal from '../../components/MultiSelectModal';
import PlayerModal from '../../components/PlayerModal';
import SelectModal from '../../components/SelectModal';
import { fixture, player } from '../../types';
import { Court, getStatus, Match, StatusENUM } from '../../types/fixture';
import { Player } from '../../types/player';
import { totalTime } from '../../utils/time';

const Home: React.FC = () => {
  const { data, service, mutate } = useFixture();
  const { data: courtStatus, mutate: mutateCourtStatus } = useCourtStatuses();

  const [visible, setVisible] = useState(false);
  const [selectPlayerVisible, setSelectPlayerVisible] = useState(false);
  const [addPlayerVisible, setAddPlayerVisible] = useState(false);
  const [addCourtVisible, setAddCourtVisible] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>();

  const onClick = useCallback(async () => {
    setAddPlayerVisible(true);
  }, []);

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

  const onAddPlayerCloseHandler = useCallback(
    async (e?: Player) => {
      setAddPlayerVisible(false);
      if (e) {
        await service.addPlayer(e.name);
        mutate();
      }
    },
    [mutate, service],
  );

  const onAddCourtCloseHandler = useCallback(
    async (e?: Court) => {
      setAddCourtVisible(false);
      if (e) {
        await service.createCourt(e.name);
        mutate();
      }
    },
    [mutate, service],
  );

  const onCreateCourtClick = useCallback(async () => {
    setAddCourtVisible(true);
  }, []);

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
    <Container>
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
      <PlayerModal
        title='Add Player'
        closeHandler={onAddPlayerCloseHandler}
        visible={addPlayerVisible}
      />
      <CourtModal
        title='Add Court'
        closeHandler={onAddCourtCloseHandler}
        visible={addCourtVisible}
      />
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
              minWidth: '100%',
              height: 300,
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
                    <Text>{item.players?.map((p) => p.player.name).join(',')}</Text>
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
                          <IconButton
                            disabled={item.status != StatusENUM.PENDING}
                            onClick={() => onEditPlayer(item)}
                          >
                            <FaUserEdit size={20} fill='#979797' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col span={3} css={{ d: 'flex' }}>
                        <Tooltip content='Start'>
                          <IconButton
                            disabled={item.status != StatusENUM.PENDING}
                            onClick={() => onStartMatch(item.id)}
                          >
                            <FaPlay size={20} fill='#0072F5' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col span={3} css={{ d: 'flex' }}>
                        <Tooltip content='End' color='error'>
                          <IconButton
                            disabled={item.status != StatusENUM.RUNNING}
                            onClick={() => onEndMatch(item.id)}
                          >
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
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
