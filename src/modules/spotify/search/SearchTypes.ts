import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "typeorm";

@ObjectType()
export class ExternalUrl {
  @Field()
  spotify: string;
}

@ObjectType()
export class Image {
  @Field()
  url: string;

  @Field()
  height: number;

  @Field()
  width: number;
}

@ObjectType()
export class BaseSearchResponse extends BaseEntity {
  @Field()
  id: string;

  @Field()
  uri: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => [Image])
  images: Image[];

  @Field()
  external_urls: ExternalUrl;
}

// Possible objects to search by
@ObjectType()
export class Artist extends BaseSearchResponse {}

@ObjectType()
export class Album extends BaseSearchResponse {
  @Field()
  release_date: string;

  @Field()
  album_type: string;

  @Field(() => [Artist])
  artists: Artist[];
}

@ObjectType()
export class Track extends BaseSearchResponse {
  @Field()
  album: Album;

  @Field(() => [Artist])
  artists: Artist[];

  @Field()
  track_number?: number;
}

// TODO create a generic object type here
// Search result items

@ObjectType()
class ArtistItems {
  @Field(() => [Artist])
  items: Artist[];
}

@ObjectType()
class AlbumItems {
  @Field(() => [Album])
  items: Album[];
}

@ObjectType()
class TrackItems {
  @Field(() => [Track])
  items: Track[];
}

// Search responses for an object

@ObjectType()
export class ArtistSearchResult {
  @Field()
  artists: ArtistItems;
}

@ObjectType()
export class AlbumSearchResult {
  @Field()
  albums: AlbumItems;
}

@ObjectType()
export class TrackSearchResult {
  @Field()
  tracks: TrackItems;
}
