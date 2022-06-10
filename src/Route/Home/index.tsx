import React, { useCallback, useState } from "react";
import { useCourtStatuses, useFixture } from "../../api/hook";
import { fixture } from "../../types";
import { getStatus } from "../../types/fixture";
import { totalTime } from "../../utils/time";

const copyToClipBoard = (text: string) => navigator.clipboard.writeText(text);

const Home: React.FC = () => {
  const { data, service, mutate } = useFixture();
  const { data: courtStatus, mutate: mutateCourtStatus } = useCourtStatuses();

  const onClick = useCallback(async () => {
    const name = prompt("Name?");
    if (name) {
      await service.addPlayer(name);
      mutate();
    }
  }, []);

  const onCreateMatchClick = useCallback(async () => {
    const courtId = prompt("Court?") || "1";
    if (courtId) {
      await service.createMatch(courtId);
      mutate();
    }
  }, []);

  const onCreateCourtClick = useCallback(async () => {
    const name = prompt("Name?") || "";
    await service.createCourt(name);
    mutate();
  }, []);

  const onStartMatch = useCallback(async (id: string) => {
    await service.startMatch(id);
    mutate();
    mutateCourtStatus();
  }, []);

  const onEndMatch = useCallback(async (id: string) => {
    await service.endtMatch(id);
    mutate();
    mutateCourtStatus();
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <h1>Fixture</h1>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 50 }}>
          <h3>
            Players <button onClick={onClick}>Add</button>
          </h3>
          {data?.players.map((p) => (
            <div>
              Name: {p.name}, Plays: {data?.playerMatchCount[p.id]}
            </div>
          ))}
        </div>
        <div>
          <h3>
            Courts <button onClick={onCreateCourtClick}>Add</button>
          </h3>
          <div style={{ display: "flex" }}>
            {data?.courts.map((c) => (
              <div
                style={{
                  border: "1px solid",
                  height: 150,
                  width: 300,
                  marginRight: 10,
                }}
              >
                ID:{" "}
                <span
                  style={{ fontWeight: "bold", cursor: "copy" }}
                  onClick={() => copyToClipBoard(c.id)}
                >
                  {c.id}
                </span>
                <br />
                Name: {c.name}
                <br />
                No. of players: {c.numberOfPlayers}
                <br />
                Current Match: {courtStatus && courtStatus[c.id]?.match?.id}
                <br />
                Status: {courtStatus && getStatus(courtStatus[c.id]?.match)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h3>
          Matches <button onClick={onCreateMatchClick}>Create</button>
        </h3>
        {data?.matches.map((m) => (
          <div style={{ marginBottom: 5, border: "1px solid" }}>
            <div>
              Match ID:{" "}
              <span
                style={{ fontWeight: "bold", cursor: "copy" }}
                onClick={() => copyToClipBoard(m.id)}
              >
                {m.id}
              </span>
              <div>Status: {fixture.getStatus(m)}</div>
              <div>
                Court:{" "}
                <span
                  style={{ fontWeight: "bold", cursor: "copy" }}
                  onClick={() => copyToClipBoard(m.court.id)}
                >
                  {m.court.id}
                </span>
              </div>
              <div>
                <span style={{ marginRight: 10 }}>Players:</span>
                {m.players?.map((p) => (
                  <span>
                    {p.player.name}({p.side}),
                  </span>
                ))}
              </div>
              <div>
                Start Time:{" "}
                {m.startTime && new Date(m.startTime).toLocaleString()}
              </div>
              <div>
                End Time: {m.endTime && new Date(m.endTime).toLocaleString()}
              </div>
              <div>
                Total Time:{" "}
                {m.startTime && m.endTime && totalTime(m.startTime, m.endTime)}
              </div>
              <button onClick={() => onStartMatch(m.id)}>Start</button>
              <button onClick={() => onEndMatch(m.id)}>End</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
