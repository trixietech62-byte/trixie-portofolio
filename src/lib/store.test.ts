import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMedia, getProjects, saveMedia, saveProjects } from "./store";

describe("media persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists media updates and notifies listeners", () => {
    const listener = vi.fn();
    window.addEventListener("trixie-store-update", listener);

    const media = getMedia();
    const updatedMedia = {
      ...media,
      advertTitle: "Updated advert",
      analyticsVideo: "https://example.com/video.mp4",
    };

    saveMedia(updatedMedia);

    expect(getMedia().advertTitle).toBe("Updated advert");
    expect(getMedia().analyticsVideo).toBe("https://example.com/video.mp4");
    expect(listener).toHaveBeenCalled();
  });

  it("persists project updates and notifies listeners", () => {
    const listener = vi.fn();
    window.addEventListener("trixie-store-update", listener);

    const projects = getProjects();
    const updatedProjects = projects.map((project) =>
      project.id === projects[0].id
        ? { ...project, title: "Updated project", liveUrl: "https://example.com/project" }
        : project
    );

    saveProjects(updatedProjects);

    expect(getProjects()[0].title).toBe("Updated project");
    expect(getProjects()[0].liveUrl).toBe("https://example.com/project");
    expect(listener).toHaveBeenCalled();
  });
});
