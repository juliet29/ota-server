import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "typeorm";

@ObjectType()
export class ExternalUrl extends BaseEntity {
  @Field()
  spotify: string;
}

@ObjectType()
export class Image extends BaseEntity {
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
  uri: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => [Image])
  images: Image[];

  @Field(() => [ExternalUrl])
  external_urls: ExternalUrl[];
}

// Possible objects to search by

@ObjectType()
export class Album extends BaseSearchResponse {
  @Field()
  release_date: string;

  @Field()
  album_type: string;
}

@ObjectType()
export class Artist extends BaseSearchResponse {}

@ObjectType()
export class Track extends BaseSearchResponse {
  @Field()
  album: Album;

  @Field(() => [Artist])
  artists: Artist[];

  @Field()
  track_number: number;
}

// Search result items

@ObjectType()
class ArtistItems {
  @Field(() => [Artist])
  items: Artist[];
}

@ObjectType()
class TrackItems {
  @Field(() => [Track])
  items: Track[];
}

@ObjectType()
class AlbumItems {
  @Field(() => [Album])
  items: Album[];
}

// Search responses for an object

@ObjectType()
export class ArtistSearchResult {
  @Field()
  artists: ArtistItems;
}

@ObjectType()
export class TrackSearchResult {
  @Field()
  tracks: TrackItems;
}

@ObjectType()
export class AlbumSearchResult {
  @Field()
  tracks: AlbumItems;
}
