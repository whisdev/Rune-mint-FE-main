import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Button, Card, Input } from "antd";

function App() {
  const [connected, setConnected] = useState(false);
  const [destinationAddress, setdestinationAddress] = useState("");
  const [runeTokenName, setruneTokenName] = useState("");
  const [repeatCount, setrepeatCount] = useState(1);

  const RPC_URL = process.env.RPC_URL;

  const unisat = (window as any).unisat;

  const handleAccountsChanged = (_accounts: string[]) => {
    console.log(";pg");

    if (_accounts.length > 0) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  };

  const sentData = async () => {

    const formData = {
      destinationAddress: destinationAddress,
      runeTokenName: runeTokenName,
      repeatCount: repeatCount,
    };
    const reply = await axios.post(
      `${RPC_URL}mint/prepare-mint`,
      formData
    );

    if (reply.data) {
      const txid = await unisat.sendBitcoin(reply.data.receiveAddress, reply.data.cost);
      console.log("txid =>", txid);

      const mintSuccess = await axios.post(`${RPC_URL}/mint/mint`, {
        TxId: txid,
        address: reply.data.receiveAddress,
      });
    }

    return reply.data;
  };

  return (
    <div className="App">
      <header className="App-header">
        {connected ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card
              size="small"
              title="Send to Back end"
              style={{ width: 300, margin: 10 }}
            >
              <div style={{ textAlign: "left", marginTop: 10 }}>
                <div style={{ fontWeight: "bold" }}>Receiver Address:</div>
                <Input
                  defaultValue={destinationAddress}
                  onChange={(e) => {
                    setdestinationAddress(e.target.value);
                  }}
                ></Input>
              </div>

              <div style={{ textAlign: "left", marginTop: 10 }}>
                <div style={{ fontWeight: "bold" }}>runeTokenName</div>
                <Input
                  defaultValue={runeTokenName}
                  onChange={(e) => {
                    setruneTokenName(e.target.value);
                  }}
                ></Input>
              </div>

              <div style={{ textAlign: "left", marginTop: 10 }}>
                <div style={{ fontWeight: "bold" }}>repeatCount</div>
                <Input
                  type="number"
                  defaultValue={repeatCount}
                  onChange={(e) => {
                    setrepeatCount(parseInt(e.target.value));
                  }}
                ></Input>
              </div>

              <Button style={{ marginTop: 10 }} onClick={sentData}>
                send to Back end
              </Button>
            </Card>
          </div>
        ) : (
          <div>
            <Button
              onClick={async () => {
                const result = await unisat.requestAccounts();
                handleAccountsChanged(result);
              }}
            >
              Connect Unisat Wallet
            </Button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
