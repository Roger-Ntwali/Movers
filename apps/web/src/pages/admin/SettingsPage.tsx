import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { uploadAnyMedia, uploadImage, uploadVideo } from "../../lib/uploadImage";
import { isCloudinaryVideoUrl } from "../../lib/cloudinaryUrl";
import type { SiteSettings } from "../../types";

const HERO_KEY = "hero_media_url";

const LABELS: Record<string, string> = {
  phone: "Phone Number",
  whatsapp_number: "WhatsApp Number (digits only, e.g. 250787225782)",
  email: "Email",
  address: "Address",
  hours: "Business Hours",
  facebook_url: "Facebook URL",
  instagram_url: "Instagram URL",
  tiktok_url: "TikTok URL",
  linkedin_url: "LinkedIn URL",
};

const IMAGE_KEYS: Record<string, string> = {
  about_image_url: "About Section Photo",
};

const VIDEO_KEYS: Record<string, string> = {
  editorial_video_url: "\"Your Belongings Are More Than Boxes\" Section Video",
};

const MEDIA_KEYS = new Set([...Object.keys(IMAGE_KEYS), ...Object.keys(VIDEO_KEYS), HERO_KEY]);

export function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<SiteSettings>("/api/settings")
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const allKeys = Array.from(
    new Set([...Object.keys(LABELS), ...Object.keys(settings).filter((k) => !MEDIA_KEYS.has(k))]),
  );
  const imageKeys = Array.from(new Set([...Object.keys(IMAGE_KEYS), ...Object.keys(settings).filter((k) => k in IMAGE_KEYS)]));
  const videoKeys = Array.from(new Set([...Object.keys(VIDEO_KEYS), ...Object.keys(settings).filter((k) => k in VIDEO_KEYS)]));

  const saveKeys = async (keys: string[], current: SiteSettings) => {
    const payload = { settings: keys.map((key) => ({ key, value: current[key] ?? "" })) };
    return api.put<SiteSettings>("/api/settings", payload);
  };

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await saveKeys(allKeys, settings);
      setSettings((prev) => ({ ...prev, ...updated }));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const onImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    setUploadError(null);
    try {
      const url = await uploadImage(file, "site");
      const updated = await saveKeys([key], { ...settings, [key]: url });
      setSettings((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const onVideoUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    setUploadError(null);
    try {
      const url = await uploadVideo(file, "site");
      const updated = await saveKeys([key], { ...settings, [key]: url });
      setSettings((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const onHeroUpload = async (file: File) => {
    setUploadingKey(HERO_KEY);
    setUploadError(null);
    try {
      const url = await uploadAnyMedia(file, "site");
      const updated = await saveKeys([HERO_KEY], { ...settings, [HERO_KEY]: url });
      setSettings((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Contact details, photos and videos — no code changes needed.</p>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Hero Background</h3>
        <div className="admin-form" style={{ maxWidth: 560 }}>
          <div className="field">
            <label>Homepage Hero Background (photo or video)</label>
            {settings[HERO_KEY] &&
              (isCloudinaryVideoUrl(settings[HERO_KEY]) ? (
                <video
                  src={settings[HERO_KEY]}
                  className="admin-thumb"
                  style={{ width: 140, height: 90, marginBottom: 10, objectFit: "cover" }}
                  muted
                />
              ) : (
                <img src={settings[HERO_KEY]} alt="" className="admin-thumb" style={{ marginBottom: 10 }} />
              ))}
            <label className="admin-upload-drop">
              {uploadingKey === HERO_KEY
                ? "Uploading..."
                : settings[HERO_KEY]
                  ? "Click to replace"
                  : "Click to upload a photo or video"}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onHeroUpload(file);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            Shows behind the homepage hero text. Falls back to an abstract gradient until you upload
            one — a wide, moderately dark photo/video of an actual move reads best against the text.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Photos</h3>
        <div className="admin-form" style={{ maxWidth: 560 }}>
          {imageKeys.map((key) => (
            <div className="field" key={key}>
              <label>{IMAGE_KEYS[key] ?? key}</label>
              {settings[key] && (
                <img src={settings[key]} alt="" className="admin-thumb" style={{ marginBottom: 10 }} />
              )}
              <label className="admin-upload-drop">
                {uploadingKey === key ? "Uploading..." : settings[key] ? "Click to replace photo" : "Click to upload a photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(key, file);
                    e.target.value = "";
                  }}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Videos</h3>
        <div className="admin-form" style={{ maxWidth: 560 }}>
          {videoKeys.map((key) => (
            <div className="field" key={key}>
              <label>{VIDEO_KEYS[key] ?? key}</label>
              {settings[key] && (
                <video
                  src={settings[key]}
                  className="admin-thumb"
                  style={{ width: 140, height: 90, marginBottom: 10, objectFit: "cover" }}
                  muted
                />
              )}
              <label className="admin-upload-drop">
                {uploadingKey === key ? "Uploading..." : settings[key] ? "Click to replace video" : "Click to upload a video"}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onVideoUpload(key, file);
                    e.target.value = "";
                  }}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          ))}
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            Keep videos under a minute or two and reasonably compressed — large files take longer to
            upload and to load for visitors.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="admin-card">
          <span className="field-error">{uploadError}</span>
        </div>
      )}

      <div className="admin-card">
        <h3 style={{ marginBottom: 16 }}>Contact Details</h3>
        <div className="admin-form" style={{ maxWidth: 560 }}>
          {allKeys.map((key) => (
            <div className="field" key={key}>
              <label>{LABELS[key] ?? key}</label>
              <input
                value={settings[key] ?? ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="admin-form-actions">
            <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {saved && <span style={{ color: "var(--green-dark)", fontWeight: 600 }}>Saved</span>}
          </div>
        </div>
      </div>
    </>
  );
}
