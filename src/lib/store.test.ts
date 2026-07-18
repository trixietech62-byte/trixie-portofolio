import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: mockFrom,
  },
}));

import { getMedia, getProjects, normalizeProjectFromSupabase, saveMedia, saveProjects } from "./store";

describe("media persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    mockFrom.mockReset();
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test_key");
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

  it("syncs saved projects to Supabase", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ upsert });

    const projects = getProjects();
    saveProjects(projects);
    await Promise.resolve();

    expect(upsert).toHaveBeenCalled();
  });

  it("maps Supabase project rows into the admin store shape", () => {
    const normalized = normalizeProjectFromSupabase({
      id: "project-1",
      title: "Supabase project",
      description: "A project from Supabase",
      tech: ["React", "TypeScript"],
      thumbnail: "https://example.com/image.png",
      screenshots: ["https://example.com/shot.png"],
      demo_video: "https://example.com/demo.mp4",
      github_url: "https://github.com/example",
      live_url: "https://example.com",
      featured: true,
      sort_order: 3,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    } as never);

    expect(normalized.title).toBe("Supabase project");
    expect(normalized.tech).toEqual(["React", "TypeScript"]);
    expect(normalized.image).toBe("https://example.com/image.png");
    expect(normalized.liveUrl).toBe("https://example.com");
    expect(normalized.githubUrl).toBe("https://github.com/example");
    expect(normalized.featured).toBe(true);
    expect(normalized.sortOrder).toBe(3);
  });
});
