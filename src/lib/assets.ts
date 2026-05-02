type AssetModule =
  | string
  | {
      src: string;
    };

const assetModules = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  import: 'default',
});

export function resolveAssetPath(source: string): string {
  const moduleKey = source.startsWith('/src/') ? `../${source.slice('/src/'.length)}` : source;
  const asset = assetModules[moduleKey] as AssetModule | undefined;

  if (!asset) {
    return source;
  }

  if (typeof asset === 'string') {
    return asset;
  }

  return asset.src;
}
