import type { youtube_v3 } from "googleapis";
import { expect, test } from "vitest";

import { Logger } from "../src/Logger";
import { Playlist } from "../src/entities/playlist";
import { Thumbnails } from "../src/entities/thumbnails";

const logger = new Logger({ name: "Playlist#fromTest", level: "ERROR" });

test("Playlist#from", () => {
    const dummy: [youtube_v3.Schema$Playlist, Playlist][] = [
        // Valid data
        [
            {
                kind: "youtube#playlist",
                etag: "tUetcgvsazHsEtH69920Qr1V6z8",
                id: "PLLt-sUPx6jaN8WmXWORKzaT-VJnzw6zgF",
                snippet: {
                    publishedAt: "2024-10-29T18:32:02.945193Z",
                    channelId: "UCBZaV3lYDMKM7Y0PF46ON0Q",
                    title: "Sample",
                    description: "",
                    thumbnails: {
                        default: {
                            url: "https://i.ytimg.com/vi/H7MKPb9MvZY/default.jpg",
                            width: 120,
                            height: 90,
                        },
                        medium: {
                            url: "https://i.ytimg.com/vi/H7MKPb9MvZY/mqdefault.jpg",
                            width: 320,
                            height: 180,
                        },
                        high: {
                            url: "https://i.ytimg.com/vi/H7MKPb9MvZY/hqdefault.jpg",
                            width: 480,
                            height: 360,
                        },
                        standard: {
                            url: "https://i.ytimg.com/vi/H7MKPb9MvZY/sddefault.jpg",
                            width: 640,
                            height: 480,
                        },
                        maxres: {
                            url: "https://i.ytimg.com/vi/H7MKPb9MvZY/maxresdefault.jpg",
                            width: 1280,
                            height: 720,
                        },
                    },
                    channelTitle: "鈴木",
                    localized: {
                        title: "Sample",
                        description: "",
                    },
                },
                status: {
                    privacyStatus: "private",
                },
                contentDetails: {
                    itemCount: 3,
                },
                player: {
                    embedHtml:
                        '<iframe width="640" height="360" src="http://www.youtube.com/embed/videoseries?list=PLLt-sUPx6jaN8WmXWORKzaT-VJnzw6zgF" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                },
            },
            new Playlist({
                id: "PLLt-sUPx6jaN8WmXWORKzaT-VJnzw6zgF",
                title: "Sample",
                description: "",
                thumbnails: new Thumbnails({
                    default: {
                        url: "https://i.ytimg.com/vi/H7MKPb9MvZY/default.jpg",
                        width: 120,
                        height: 90,
                    },
                    medium: {
                        url: "https://i.ytimg.com/vi/H7MKPb9MvZY/mqdefault.jpg",
                        width: 320,
                        height: 180,
                    },
                    high: {
                        url: "https://i.ytimg.com/vi/H7MKPb9MvZY/hqdefault.jpg",
                        width: 480,
                        height: 360,
                    },
                    standard: {
                        url: "https://i.ytimg.com/vi/H7MKPb9MvZY/sddefault.jpg",
                        width: 640,
                        height: 480,
                    },
                    maxres: {
                        url: "https://i.ytimg.com/vi/H7MKPb9MvZY/maxresdefault.jpg",
                        width: 1280,
                        height: 720,
                    },
                }),
                privacy: "private",
                count: 3,
                publishedAt: new Date("2024-10-29T18:32:02.945193Z"),
                channelId: "UCBZaV3lYDMKM7Y0PF46ON0Q",
                channelName: "鈴木",
            }),
        ],
    ];

    for (const [data, expected] of dummy) {
        expect(Playlist.from(data, logger).data).toEqual(expected);
    }
});
