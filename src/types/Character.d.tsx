export type Thumbnail = {
  path: string;
  extension: string;
};

export type URL = {
  type: string;
  url: string;
}[];

export type itemResource = {
  resourceURI: string;
  name: string;
  type?: string;
};

export type CharacterResourceItem = {
  available: number;
  returned: number;
  collectionURI: string;
  items: itemResource[];
};

export type TransformedCharacterType = Omit<CharacterResourceItem, "items"> & {
  items: string[];
};

export type APICharacterData = {
  id: number;
  name: string;
  description: string;
  modified: Date;
  resourceURI: string;
  urls: URL;
  thumbnail: Thumbnail;
  comics: {
    available: number;
    returned: number;
    collectionURI: string;
    items: itemResource[];
  };
  stories: {
    available: number;
    returned: number;
    collectionURI: string;
    items: itemResource[];
  };
  events: {
    available: number;
    returned: number;
    collectionURI: string;
    items: itemResource[];
  };
  series: {
    available: number;
    returned: number;
    collectionURI: string;
    items: itemResource[];
  };
};

export type APIResponse = {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: APICharacterData[];
  };
  etag: string;
};
