import {
  CharacterResourceItem,
  TransformedCharacterType,
  Thumbnail,
  URL,
  APICharacterData,
} from "../types/Character.d";

class Character {
  id: number;
  name: string;
  description: string;
  thumbnail: Thumbnail;
  comics: TransformedCharacterType;
  series: TransformedCharacterType;
  stories: TransformedCharacterType;
  events: TransformedCharacterType;
  urls: URL;

  constructor(characterData: APICharacterData) {
    const {
      id,
      name,
      description,
      thumbnail,
      comics,
      series,
      stories,
      events,
      urls,
    } = characterData;

    this.id = id;
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
    this.comics = this.transformResourceItem(comics);
    this.series = this.transformResourceItem(series);
    this.stories = this.transformResourceItem(stories);
    this.events = this.transformResourceItem(events);
    this.urls = urls;
  }

  /**
   * There's another property on the resource object that is fetched
   * from the API that i don't really need here
   * so might as well flatten this array of items
   *
   * @param resource - Resource item fetched from the dataBase.
   * @returns the same object with items turned into an string array
   **/
  private transformResourceItem(
    resource: CharacterResourceItem
  ): TransformedCharacterType {
    const transformedItems = resource.items.map((item) => item.name);

    return { ...resource, items: transformedItems };
  }
}

export default Character;
