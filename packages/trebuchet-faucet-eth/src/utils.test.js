const sinon = require("sinon");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const { Client, Server, protoFromFile } = require("./utils");

describe("utils", () => {
  beforeEach(() => {
    sinon.stub(protoLoader, "loadSync");
    sinon.stub(grpc, "loadPackageDefinition");

    protoLoader.loadSync.returns("PackageDefinition");
    grpc.loadPackageDefinition.returns("Proto");
  });
  afterEach(() => {
    protoLoader.loadSync.restore();
    grpc.loadPackageDefinition.restore();
  });
  describe("protoFromFile", () => {
    test("should load package definition with grpc", () => {
      const proto = protoFromFile("some/path");
      expect(protoLoader.loadSync.called).toBe(true);
      expect(protoLoader.loadSync.args[0]).toEqual([
        "some/path",
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true
        }
      ]);
      expect(grpc.loadPackageDefinition.called).toBe(true);
      expect(grpc.loadPackageDefinition.args[0][0]).toEqual(
        "PackageDefinition"
      );
      expect(proto).toBe("Proto");
    });
  });

  describe("Client", () => {
    test("should return grpc client from proto", () => {
      class FakeFaucet {
        constructor(url, client) {
          this.url = url;
          this.client = client;
        }
      }
      grpc.credentials = { createInsecure: sinon.stub() };
      grpc.credentials.createInsecure.returns("INSECURE_CLIENT");
      grpc.loadPackageDefinition.returns({ Faucet: FakeFaucet });

      const client = Client("protopath", "url");

      expect(client.url).toBe("url");
      expect(client.client).toBe("INSECURE_CLIENT");
    });
  });

  describe("Server", () => {
    test("should return grpc server from proto", () => {
      class FakeServer {
        constructor() {
          this.name = "FAKE_SERVER";
        }

        bind(url, client) {
          this.url = url;
          this.client = client;
        }

        addService(svc, ctrl) {
          this.svc = svc;
          this.ctrl = ctrl;
        }
      }
      sinon.stub(grpc.ServerCredentials, "createInsecure");
      grpc.Server = FakeServer;
      grpc.loadPackageDefinition.returns({
        Faucet: { service: "SOME_SERVICE" }
      });
      grpc.ServerCredentials.createInsecure.returns("INSECURE_CLIENT");
      const server = Server({
        protoPath: "protopath",
        url: "url",
        services: [
          {
            name: "Faucet",
            controllers: "SOME_CONTROLLER"
          }
        ]
      });

      expect(server.name).toBe("FAKE_SERVER");
      expect(server.svc).toBe("SOME_SERVICE");
      expect(server.ctrl).toBe("SOME_CONTROLLER");
      expect(server.url).toBe("url");
      expect(server.client).toBe("INSECURE_CLIENT");
      grpc.ServerCredentials.createInsecure.restore();
    });
  });
});
