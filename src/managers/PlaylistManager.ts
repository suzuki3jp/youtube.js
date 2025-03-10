import { google } from "googleapis";
import { type Result, err, ok } from "neverthrow";

import type { Logger } from "../Logger";
import type { OAuthProviders } from "../OAuthProvider";
import { Pagination } from "../Pagination";
import { Playlist } from "../entities/playlist";
import type { Privacy } from "../entities/privacy";
import { LikelyBugError, type YouTubesJsErrors } from "../errors";
import type { NativeClient } from "../types";
import { wrapGaxios } from "../utils";

/**
 * Manager for playlist endpoints.
 * Provides methods for `/youtube/v3/playlists`.
 *
 * {@link https://developers.google.com/youtube/v3/docs/playlists | YouTube Data API Reference}
 */
export class PlaylistManager {
    private client: NativeClient;
    private logger: Logger;
    private readonly MAX_RESULTS = 50;
    private readonly ALL_PARTS = ["id", "contentDetails", "snippet", "status"];

    constructor({ oauth, logger }: PlaylistManagerOptions) {
        this.client = google.youtube({
            version: "v3",
            auth: oauth.getNativeOauth(),
        });
        this.logger = logger.createChild("PlaylistManager");
    }

    /**
     * Fetches the playlists owned by the authenticated user.
     *
     * @remarks This operation uses 1 quota unit.
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/list | YouTube Data API Reference}
     * @param pageToken - The token for pagination.
     * @example
     * ```ts
     * import { ApiClient, StaticOAuthProvider } from "youtubes.js";
     *
     * const oauth = new StaticOAuthProvider({
     *   accessToken: "ACCESS_TOKEN",
     * });
     *
     * const client = new ApiClient({ oauth });
     * const playlists = await client.playlists.getMine(); // Result<Pagination<Playlist[]>, YouTubesJsErrors>
     * ```
     */
    public async getMine(
        pageToken?: string,
    ): Promise<Result<Pagination<Playlist[]>, YouTubesJsErrors>> {
        const rawData = await wrapGaxios(
            this.client.playlists.list({
                part: this.ALL_PARTS,
                mine: true,
                maxResults: this.MAX_RESULTS,
                pageToken,
            }),
        );
        if (rawData.isErr()) return err(rawData.error);
        if (!rawData.value.items)
            return err(new LikelyBugError("The raw data is missing items."));
        const playlists = Playlist.fromMany(rawData.value.items, this.logger);
        if (playlists.isErr()) return err(playlists.error);

        return ok(
            new Pagination({
                data: playlists.value,
                logger: this.logger,
                prevToken: rawData.value.prevPageToken,
                nextToken: rawData.value.nextPageToken,
                resultsPerPage: rawData.value.pageInfo?.resultsPerPage,
                totalResults: rawData.value.pageInfo?.totalResults,
                getWithToken: (token) => this.getMine(token),
            }),
        );
    }

    /**
     * Fetches a playlist by its ID.
     *
     * @remarks
     * - This operation uses 1 quota unit.
     * - Note: The YouTube API returns empty data instead of an error when a playlist with the specified ID is not found.
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/list | YouTube Data API Reference}
     * @param ids - The IDs of the playlist.
     * @param pageToken - The token for pagination.
     * @example
     * ```ts
     * import { ApiClient, StaticOAuthProvider } from "youtubes.js";
     *
     * const oauth = new StaticOAuthProvider({
     *  accessToken: "ACCESS_TOKEN",
     * });
     * const client = new ApiClient({ oauth });
     * const playlists = await client.playlists.getByIds(["ID1", "ID2"]) // Result<Pagination<Playlist[]>, YouTubesJsErrors>
     * ```
     */
    public async getByIds(
        ids: string[],
        pageToken?: string,
    ): Promise<Result<Pagination<Playlist[]>, YouTubesJsErrors>> {
        const rawData = await wrapGaxios(
            this.client.playlists.list({
                part: this.ALL_PARTS,
                id: ids,
                maxResults: this.MAX_RESULTS,
                pageToken,
            }),
        );
        if (rawData.isErr()) return err(rawData.error);
        if (!rawData.value.items)
            return err(new LikelyBugError("The raw data is missing items."));
        const playlists = Playlist.fromMany(rawData.value.items, this.logger);
        if (playlists.isErr()) return err(playlists.error);

        return ok(
            new Pagination({
                data: playlists.value,
                logger: this.logger,
                prevToken: rawData.value.prevPageToken,
                nextToken: rawData.value.nextPageToken,
                resultsPerPage: rawData.value.pageInfo?.resultsPerPage,
                totalResults: rawData.value.pageInfo?.totalResults,
                getWithToken: (token) => this.getByIds(ids, token),
            }),
        );
    }

    /**
     * Fetches the playlists of a channel by its ID.
     *
     * @remarks
     * - This operation uses 1 quota unit.
     * - Retrieves all playlists when given an authenticated user's channel ID. Otherwise, only public playlists are accessible.
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/list | YouTube Data API Reference}
     * @param id - The ID of the channel.
     * @param pageToken - The token for pagination.
     * @example
     * ```ts
     * import { ApiClient, StaticOAuthProvider } from "youtubes.js";
     *
     * const oauth = new StaticOAuthProvider({
     *  accessToken: "ACCESS_TOKEN",
     * });
     * const client = new ApiClient({ oauth });
     * const playlists = await client.playlists.getByChannelId("CHANNEL_ID"); // Result<Pagination<Playlist[]>, YouTubesJsErrors>
     * ```
     */
    public async getByChannelId(
        id: string,
        pageToken?: string,
    ): Promise<Result<Pagination<Playlist[]>, YouTubesJsErrors>> {
        const rawData = await wrapGaxios(
            this.client.playlists.list({
                part: this.ALL_PARTS,
                channelId: id,
                maxResults: this.MAX_RESULTS,
                pageToken,
            }),
        );
        if (rawData.isErr()) return err(rawData.error);
        if (!rawData.value.items)
            return err(new LikelyBugError("The raw data is missing items."));
        const playlists = Playlist.fromMany(rawData.value.items, this.logger);
        if (playlists.isErr()) return err(playlists.error);

        return ok(
            new Pagination({
                data: playlists.value,
                logger: this.logger,
                prevToken: rawData.value.prevPageToken,
                nextToken: rawData.value.nextPageToken,
                resultsPerPage: rawData.value.pageInfo?.resultsPerPage,
                totalResults: rawData.value.pageInfo?.totalResults,
                getWithToken: (token) => this.getByChannelId(id, token),
            }),
        );
    }

    /**
     * Creates a playlist.
     *
     * @remarks
     * - This operation uses 50 quota units.
     * - There is a limit of approximately 10 playlists per day for creation.
     * - For more details, see the issue: https://issuetracker.google.com/issues/255216949
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/insert | YouTube Data API Reference}
     * @param options - Options for creating a playlist.
     */
    public async create(
        options: CreatePlaylistOptions,
    ): Promise<Result<Playlist, YouTubesJsErrors>> {
        const { title, description, privacy, defaultLanguage, localizations } =
            options;
        const rawData = await wrapGaxios(
            this.client.playlists.insert({
                part: this.ALL_PARTS,
                requestBody: {
                    snippet: {
                        title,
                        description,
                        defaultLanguage,
                    },
                    status: {
                        privacyStatus: privacy,
                    },
                    localizations,
                },
            }),
        );
        if (rawData.isErr()) return err(rawData.error);
        const playlist = Playlist.from(rawData.value, this.logger);
        if (playlist.isErr()) return err(playlist.error);

        return ok(playlist.value);
    }

    /**
     * Updates a playlist by its ID.
     *
     * @remarks
     * - This operation uses 50 quota units.
     * - [If you are submitting an update request, and your request does not specify a value for a property that already has a value, the property's existing value will be deleted.](https://developers.google.com/youtube/v3/docs/playlists/update#request-body)
     * - For example, when updating a playlist that has a description set, if you don't specify the `description`, it will be set to an empty string.
     * - However, for the `privacy` property, it seems to remain unchanged if not specified.
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/update | YouTube Data API Reference}
     * @param options - Options for updating a playlist.
     * @returns - The updated playlist.
     */
    public async updateById(
        options: UpdatePlaylistOptions,
    ): Promise<Result<Playlist, YouTubesJsErrors>> {
        const {
            id,
            title,
            description,
            privacy,
            defaultLanguage,
            localizations,
        } = options;
        const rawData = await wrapGaxios(
            this.client.playlists.update({
                part: this.ALL_PARTS,
                requestBody: {
                    id,
                    snippet: {
                        title,
                        description,
                        defaultLanguage,
                    },
                    status: {
                        privacyStatus: privacy,
                    },
                    localizations,
                },
            }),
        );
        if (rawData.isErr()) return err(rawData.error);
        const playlist = Playlist.from(rawData.value, this.logger);
        if (playlist.isErr()) return err(playlist.error);

        return ok(playlist.value);
    }

    /**
     * Deletes a playlist by its ID.
     *
     * @remarks This operation uses 50 quota units.
     *
     * {@link https://developers.google.com/youtube/v3/docs/playlists/delete | YouTube Data API Reference}
     * @param playlistId - The ID of the playlist.
     */
    public async deleteById(playlistId: string): Promise<void> {
        await this.client.playlists.delete({
            id: playlistId,
        });
    }
}

export interface CreatePlaylistOptions {
    /**
     * The title of the playlist.
     */
    title: string;

    /**
     * The description of the playlist.
     */
    description?: string;

    /**
     * The privacy status of the playlist.
     */
    privacy?: Privacy;

    /**
     * The language of the playlist's default metadata.
     */
    defaultLanguage?: string;

    /**
     * The localized metadata for the playlist.
     */
    localizations?: Record<string, { title: string; description: string }>;
}

export interface UpdatePlaylistOptions {
    id: string;

    title: string;

    description?: string;

    privacy?: Privacy;

    defaultLanguage?: string;

    localizations?: Record<string, { title: string; description: string }>;
}

export interface PlaylistManagerOptions {
    oauth: OAuthProviders;
    logger: Logger;
}
