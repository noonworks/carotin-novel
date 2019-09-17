import { StoreManagerInstance } from './store/StoreManager';
import { ThemeManagerInstance } from './theme/ThemeManager';
import { FontManagerInstance } from './font/FontManager';
import { Theme } from './theme/Theme';
import { Font } from './font/Font';

function getOverwriteConfig(
  articleId: string
): { theme: boolean; font: boolean } {
  const w = StoreManagerInstance.getWork(articleId);
  if (!w || !w.styles) {
    return { theme: false, font: false };
  }
  return { theme: w.styles.overwriteTheme, font: w.styles.overwriteFont };
}

type StyleSettings = {
  theme: { index: number; theme: Theme | null };
  font: { index: number; font: Font | null };
};

export class WorkConfig {
  private articleId = '';
  private authorSetting: StyleSettings;
  private overwrite: {
    theme: boolean;
    font: boolean;
  };
  private userSetting: StyleSettings;

  public get authorDefault(): StyleSettings {
    return this.authorSetting;
  }

  public get themes(): Theme[] {
    return ThemeManagerInstance.themes;
  }

  public get theme(): Theme {
    this.reload();
    // no author setting
    if (!this.authorSetting.theme.theme) {
      return this.userSetting.theme.theme || ThemeManagerInstance.default.theme;
    }
    // when there is an author setting...
    if (this.overwrite.theme && this.userSetting.theme.theme) {
      return this.userSetting.theme.theme;
    }
    return this.authorSetting.theme.theme;
  }

  public get fonts(): Font[] {
    return FontManagerInstance.fonts;
  }

  public get font(): Font {
    this.reload();
    // no author setting
    if (!this.authorSetting.font.font) {
      return this.userSetting.font.font || FontManagerInstance.default.font;
    }
    // when there is an author setting...
    if (this.overwrite.font && this.userSetting.font.font) {
      return this.userSetting.font.font;
    }
    return this.authorSetting.font.font;
  }

  constructor() {
    this.authorSetting = {
      font: FontManagerInstance.authorDefault,
      theme: ThemeManagerInstance.authorDefault
    };
    this.overwrite = { theme: false, font: false };
    const config = StoreManagerInstance.config;
    this.userSetting = {
      theme: ThemeManagerInstance.getTheme(
        config.theme.namespace,
        config.theme.id
      ),
      font: FontManagerInstance.getFont(config.font.id)
    };
  }

  public setArticleId(articleId: string): void {
    this.articleId = articleId;
  }

  public reload(): void {
    this.overwrite = getOverwriteConfig(this.articleId);
    const config = StoreManagerInstance.config;
    this.userSetting = {
      theme: ThemeManagerInstance.getTheme(
        config.theme.namespace,
        config.theme.id
      ),
      font: FontManagerInstance.getFont(config.font.id)
    };
  }
}

export const WorkConfigInstance = new WorkConfig();
