import grpc from 'grpc';
import {loadSync} from '@grpc/proto-loader';

interface Service {
  name: string;
  controllers: any;
}

const protoFromFile = (protoPath: string): any => {
  const packageDefinition = loadSync(
    protoPath,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
  return grpc.loadPackageDefinition(packageDefinition);
}

export const Client = (protoPath: string, url: string): any => {
  const proto = protoFromFile(protoPath);
  return new proto.Faucet(url, grpc.credentials.createInsecure());
}

export const Server = ({ protoPath, url, services }: {protoPath: string, url: string, services: Service[]}): any => {
  const proto = protoFromFile(protoPath);
  const server = new grpc.Server();
  services.forEach(svc => {
    server.addService(proto[svc.name].service, svc.controllers);
  });
  server.bind(url, grpc.ServerCredentials.createInsecure());
  return server;
}