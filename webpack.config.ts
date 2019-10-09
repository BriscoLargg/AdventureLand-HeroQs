import fs from "fs";
import http, { ClientRequest } from "http";
import path from "path";
import querystring from "querystring";
import webpack from "webpack";

// Useful type definitions
interface IChunk {
  name: string;
  hash: string;
  files: string[];
  entryModule: {
    rawRequest: string;
  };
}

interface ISaveSlot {
  name: string;
  slot: number;
}

interface IApiResponse {
  message: string;
}

// Utility functions
const mkSaveSlot = (name: string, slot: number): ISaveSlot => ({ name, slot });

function getAuthCookie(): string {
  if (!fs.existsSync(".secret")) {
    throw new Error("You need to create a .secret file with your auth token.");
  }
  const secret = fs.readFileSync(".secret").toString();
  return `auth=${secret}`;
}

////////////////////////////////////////////////////////////////////////////////
///                          \/ EDIT THIS \/                                ////
////////////////////////////////////////////////////////////////////////////////
// This structure determines which files are compiled as well as
// how they are saved to AL
const saveMap: { [filename: string]: ISaveSlot } = {
    "./src/ai/HeroQs/Classes/Mage.ts": mkSaveSlot("Mage", 3),
    "./src/ai/HeroQs/Classes/Priest.ts": mkSaveSlot("Priest", 2),
    "./src/ai/HeroQs/Classes/Ranger.ts": mkSaveSlot("Ranger", 1),
  // "./src/ai/merchant.ts": mkSaveSlot("merchant", 3),
};
////////////////////////////////////////////////////////////////////////////////
///                          /\ EDIT THIS /\                                ////
////////////////////////////////////////////////////////////////////////////////

const authCookie: string = getAuthCookie();

class ALUploader {
  // A map from our chunks to their versions so that we can avoid uploading
  // files that didn't change
  private chunkVersions: Map<string, string> = new Map();

  // A map from the output JS file names to the request that is handling them,
  // so that we can abort ongoing requests if a rebuild is triggered before a request
  // from a previous rebuild is finished
  private requestMap: Map<string, ClientRequest> = new Map();

  private uploadFile = (jsFile: string, saveName: string, slot: number) => {
    const code = fs.readFileSync(jsFile);
    const req = http.request(
      {
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": authCookie,
        },
        "hostname": "adventure.land",
        "method": "POST",
        "path": "/api/save_code",
      },
      (res) => {
        res.on("data", (response) => {
          const asJson: IApiResponse[] = JSON.parse(response.toString());
          console.log(`${jsFile}: ${asJson[0].message}`);
        });
      }
    );
    req.on("error", (err) => {
      console.error("Error talking to the AL API:", err);
    });

    const r = this.requestMap.get(jsFile);
    if (r) {
      console.log("Aborted ongoing request..");
      r.abort();
    }
    this.requestMap.set(jsFile, req);

    // yes, the API is kind of convoluted.
    // pack it into a JSON object, stringify it and then encode such that
    // we do: /save_code?method=save_code?args=<URI encoded json object>
    const obj = {
      "arguments": JSON.stringify({
        "code": code.toString(),
        "log": "0",
        "name": saveName,
        "slot": slot.toString(),
      }),
      "method": "save_code",
    };

    req.write(querystring.stringify(obj));
    req.end();
  }

  private processFile = (typescriptFile: string, jsFile: string) => {
    console.log("Processing ", typescriptFile, jsFile);
    const save = saveMap[typescriptFile];
    this.uploadFile(jsFile, save.name, save.slot);
  }

  private processChunk = (chunk: IChunk) => {
    chunk.files.forEach((f) => this.processFile(chunk.entryModule.rawRequest, f));
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.afterEmit.tap("ALUploader", (compilation) => {
      const changed: IChunk[] = compilation.chunks.filter((chunk: IChunk) => {
        const old = this.chunkVersions.get(chunk.name);
        this.chunkVersions.set(chunk.name, chunk.hash);
        return !old || old !== chunk.hash;
      });

      changed.forEach(this.processChunk);
    });
  }
}

const config: webpack.Configuration = {
    "devtool": "eval-source-map",
    "mode": "development",
    // list all the files here that you would like to build individually.

    "entry": Object.entries(saveMap).reduce((prev, [filename, save]) => ({ ...prev, [save.name]: filename }), {}),
    "module": {
        "rules": [{
                "exclude": /node_modules/,
                "include": [path.resolve(__dirname, "src")],
                "test": /\.ts$/,
                "use": "babel-loader", },
                ],
    },
    "output": {
        "filename": "dist/[name].js",
        "path": __dirname,
    },
    "plugins": [new ALUploader()],
    "resolve": {
        "extensions": [".ts", ".js"],
        "modules": [ path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "src")],
    },
};

export default config;
